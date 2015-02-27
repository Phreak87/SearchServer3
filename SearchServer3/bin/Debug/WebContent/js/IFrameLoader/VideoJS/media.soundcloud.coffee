debug = window.console.debug.bind console
# videojs = require "video.js"
# URI = require "URIjs"
###
Documentation can be generated using {https://github.com/coffeedoc/codo Codo}
###

###
Add a script to head with the given @scriptUrl
###
addScriptTag = (scriptUrl)->
	debug "adding script #{scriptUrl}"
	tag = document.createElement 'script'
	tag.src = scriptUrl
	headTag = document.getElementsByTagName('head')[0]
	headTag.parentNode.appendChild tag

###
Soundcloud Media Controller - Wrapper for Soundcloud Media API
API SC.Widget documentation: http://developers.soundcloud.com/docs/api/html5-widget
API Track documentation: http://developers.soundcloud.com/docs/api/reference#tracks
@param [videojs.Player] player
@option options {Object} options As given by vjs.Player.prototype.loadTech
                         Should include a source attribute as one given to @see videojs.Soundcloud::src
@param [Function] ready
###
videojs.Soundcloud = videojs.MediaTechController.extend
	init: (player, options, ready)->
		debug "initializing Soundcloud tech"

		videojs.MediaTechController.call(@, player, options, ready)

		# Init attributes

		@volumeVal = 0
		@durationMilliseconds = 1
		@currentPositionSeconds = 0
		@loadPercentageDecimal = 0
		@paused_ = true

		@player_ = player
		@soundcloudSource = null
		if "string" == typeof options.source
			debug "given string source: #{options.source}"
			@soundcloudSource = options.source
		else if "object" == typeof options.source
			@soundcloudSource = options.source.src

		# Create the iframe for the soundcloud API
		@scWidgetId = "#{@player_.id()}_soundcloud_api_#{Date.now()}"
		@scWidgetElement = videojs.Component::createEl 'iframe',
			id: @scWidgetId
			className: 'vjs-tech'
			scrolling: 'no'
			marginWidth: 0
			marginHeight: 0
			frameBorder: 0
			webkitAllowFullScreen: "true"
			mozallowfullscreen: "true"
			allowFullScreen: "true"
			src: "https://w.soundcloud.com/player/?url=#{@soundcloudSource}"
		@scWidgetElement.style.visibility = "hidden"

		@player_.el().appendChild @scWidgetElement
		@player_.el().classList.add "backgroundContainer"
		debug "added widget div with src: #{@scWidgetElement.src}"

		# Make autoplay work for iOS
		if @player_.options().autoplay
			@playOnReady = true

		@readyToPlay = false
		# Called by @triggerReady once the player is ready for business
		@ready =>
			debug "ready to play"
			@readyToPlay = true

			# Trigger to enable controls
			@player_.trigger "loadstart"

		debug "loading soundcloud"
		@loadSoundcloud()

###
Destruct the tech and it's DOM elements
###
videojs.Soundcloud::dispose = ->
	debug "dispose"
	if @scWidgetElement
		@scWidgetElement.parentNode.removeChild @scWidgetElement
		debug "Removed widget Element"
		debug @scWidgetElement
	@player_.el().classList.remove "backgroundContainer"
	@player_.el().style.backgroundImage = ""
	debug "removed CSS"
	delete @soundcloudPlayer if @soundcloudPlayer

videojs.Soundcloud::load = ->
	debug "loading"
	@loadSoundcloud()

###
Called from [vjs.Player.src](https://github.com/videojs/video.js/blob/master/docs/api/vjs.Player.md#src-source-)
Triggers "newSource" from vjs.Player once source has been changed

@option option [String] src Source to load
@return [String] current source if @src isn't given
###
videojs.Soundcloud.prototype.src = (src)->
	return @soundcloudSource if not src
	debug "load a new source(#{src})"
	@soundcloudPlayer.load src, callback: =>
		@soundcloudSource = src
		@onReady()
		debug "trigger 'newSource' from #{src}"
		@player_.trigger "newSource"

videojs.Soundcloud::updatePoster = ->
	try
		# Get artwork for the sound
		@soundcloudPlayer.getSounds (sounds) =>
			debug "got sounds"
			return if sounds.length != 1

			sound = sounds[0]
			return if  not sound.artwork_url
			# Take the larger version as described at https://developers.soundcloud.com/docs/api/reference#artwork_url
			posterUrl = sound.artwork_url.replace "large.jpg", "t500x500.jpg"
			debug "Setting poster to #{posterUrl}"
			@player_.el().style.backgroundImage = "url('#{posterUrl}')"
			#@player_.poster(posterUrl)
	catch e
		debug "Could not update poster"

videojs.Soundcloud::play = ->
	if @readyToPlay
		debug "play"
		@soundcloudPlayer.play()
	else
		debug "to play on ready"
		# We will play it when the API will be ready
		@playOnReady = true

###
Toggle the playstate between playing and paused
###
videojs.Soundcloud::toggle = ->
	debug "toggle"
	# We used @player_ to trigger events for changing the display
	if @player_.paused()
		@player_.play()
	else
		@player_.pause()

videojs.Soundcloud::pause = ->
	debug "pause"
	@soundcloudPlayer.pause()
videojs.Soundcloud::paused = ->
	debug "paused: #{@paused_}"
	@paused_

###
@return track time in seconds
###
videojs.Soundcloud::currentTime = ->
	debug "currentTime #{@currentPositionSeconds}"
	@currentPositionSeconds

videojs.Soundcloud::setCurrentTime = (seconds)->
	debug "setCurrentTime #{seconds}"
	@soundcloudPlayer.seekTo seconds*1000
	@player_.trigger "seeking"

###
@return total length of track in seconds
###
videojs.Soundcloud::duration = ->
	#debug "duration: #{@durationMilliseconds / 1000}"
	@durationMilliseconds / 1000

# TODO Fix buffer-range calculations
videojs.Soundcloud::buffered = ->
	timePassed = @duration() * @loadPercentageDecimal
	debug "buffered #{timePassed}" if timePassed > 0
	videojs.createTimeRange 0, timePassed

videojs.Soundcloud::volume = ->
	debug "volume: #{@volumeVal* 100}%"
	@volumeVal

###
Called from [videojs::Player::volume](https://github.com/videojs/video.js/blob/master/docs/api/vjs.Player.md#volume-percentasdecimal-)
@param percentAsDecimal {Number} A decimal number [0-1]
###
videojs.Soundcloud::setVolume = (percentAsDecimal)->
	debug "setVolume(#{percentAsDecimal}) from #{@volumeVal}"
	if percentAsDecimal != @volumeVal
		@volumeVal = percentAsDecimal
		@soundcloudPlayer.setVolume @volumeVal
		debug "volume has been set"
		@player_.trigger 'volumechange'

videojs.Soundcloud::muted = ->
	debug "muted: #{@volumeVal == 0}"
	@volumeVal == 0

###
Soundcloud doesn't do muting so we need to handle that.

A possible pitfall is when this is called with true and the volume has been changed elsewhere.
We will use @unmutedVolumeVal

@param {Boolean}
###
videojs.Soundcloud::setMuted = (muted)->
	debug "setMuted(#{muted})"
	if muted
		@unmuteVolume = @volumeVal
		@setVolume 0
	else
		@setVolume @unmuteVolume


###
Take a wild guess ;)
###
videojs.Soundcloud.isSupported = ->
	debug "isSupported: #{true}"
	return true

###
Fullscreen of audio is just enlarging making the container fullscreen and using it's poster as a placeholder.
###
videojs.Soundcloud::supportsFullScreen = ()->
	debug "we support fullscreen!"
	return true

###
Fullscreen of audio is just enlarging making the container fullscreen and using it's poster as a placeholder.
###
videojs.Soundcloud::enterFullScreen = ()->
	debug "enterfullscreen"
	@scWidgetElement.webkitEnterFullScreen()

###
We return the player's container to it's normal (non-fullscreen) state.
###
videojs.Soundcloud::exitFullScreen = ->
	debug "EXITfullscreen"
	@scWidgetElement.webkitExitFullScreen()

###
Simple URI host check of the given url to see if it's really a soundcloud url
@param url {String}
###
videojs.Soundcloud::isSoundcloudUrl = (url)->
	/^(https?:\/\/)?(www.)?soundcloud.com\//i.test(url)

###
We expect "audio/soundcloud" or a src containing soundcloud
###
videojs.Soundcloud::canPlaySource = videojs.Soundcloud.canPlaySource = (source)->
	if typeof source == "string"
		return videojs.Soundcloud::isSoundcloudUrl source
	else
		debug "Can play source?"
		debug source
		ret = (source.type == 'audio/soundcloud') or videojs.Soundcloud::isSoundcloudUrl(source.src)
		debug ret
		return ret


###
Take care of loading the Soundcloud API
###
videojs.Soundcloud::loadSoundcloud = ->
	debug "loadSoundcloud"

	# Prepare everything for playing
	if videojs.Soundcloud.apiReady and not @soundcloudPlayer
		debug "simply initializing the widget"
		@initWidget()
	else
		# Load the Soundcloud API if it is the first Soundcloud video
		if not videojs.Soundcloud.apiLoading
			debug "loading soundcloud api"

			# Initiate the soundcloud tech once the API is ready
			checkSoundcloudApiReady = =>
				if typeof window.SC != "undefined"
					debug "soundcloud api is ready"
					videojs.Soundcloud.apiReady = true
					window.clearInterval videojs.Soundcloud.intervalId
					@initWidget()
					debug "cleared interval"
			addScriptTag "http://w.soundcloud.com/player/api.js"
			videojs.Soundcloud.apiLoading = true
			videojs.Soundcloud.intervalId = window.setInterval checkSoundcloudApiReady, 10

###
It should initialize a soundcloud Widget, which will be our player
and which will react to events.
###
videojs.Soundcloud::initWidget = ->
	debug "Initializing the widget"

	@soundcloudPlayer = SC.Widget @scWidgetId
	debug "created widget"
	@soundcloudPlayer.bind SC.Widget.Events.READY, =>
		@onReady()
	debug "attempted to bind READY"
	@soundcloudPlayer.bind SC.Widget.Events.PLAY_PROGRESS, (eventData)=>
		@onPlayProgress eventData.relativePosition

	@soundcloudPlayer.bind SC.Widget.Events.LOAD_PROGRESS, (eventData) =>
		debug "loading"
		@onLoadProgress eventData.loadedProgress

	@soundcloudPlayer.bind SC.Widget.Events.ERROR, =>
		@onError()

	@soundcloudPlayer.bind SC.Widget.Events.PLAY, =>
		@onPlay()

	@soundcloudPlayer.bind SC.Widget.Events.PAUSE, =>
		@onPause()

	@soundcloudPlayer.bind SC.Widget.Events.FINISH, =>
		@onFinished()

	@soundcloudPlayer.bind SC.Widget.Events.SEEK, (event) =>
		@onSeek event.currentPosition

	# onReady won't be called by soundcloud when given an empty source
	if not @soundcloudSource
		@triggerReady()


###
Callback for soundcloud's READY event.
###
videojs.Soundcloud::onReady = ->
	debug "onReady"

	# Preparing to handle muting
	@soundcloudPlayer.getVolume (volume) =>
		@unmuteVolume = volume
		debug "current volume on soundcloud: #{@unmuteVolume}"
		@setVolume @unmuteVolume


	try
		# It's async and won't change so let's do this now
		@soundcloudPlayer.getDuration (duration) =>
			@durationMilliseconds = duration
			@player_.trigger 'durationchange'
			@player_.trigger "canplay"
	catch e
		debug "could not get the duration"


	@updatePoster()

	# Trigger buffering
	#@soundcloudPlayer.play()
	#@soundcloudPlayer.pause()

	@triggerReady()
	# Play right away if we clicked before ready
	try
		@soundcloudPlayer.play() if @playOnReady
	catch e
		debug "could not play onready"

	debug "finished onReady"


###
Callback for Soundcloud's PLAY_PROGRESS event
It should keep track of how much has been played.
@param {Decimal= playPercentageDecimal} [0...1] How much has been played  of the sound in decimal from [0...1]
###
videojs.Soundcloud::onPlayProgress = (playPercentageDecimal)->
	debug "onPlayProgress"
	@currentPositionSeconds = @durationMilliseconds * playPercentageDecimal / 1000
	@player_.trigger "playing"

###
Callback for Soundcloud's LOAD_PROGRESS event.
It should keep track of how much has been buffered/loaded.
@param {Decimal= loadPercentageDecimal} How much has been buffered/loaded of the sound in decimal from [0...1]
###
videojs.Soundcloud::onLoadProgress = (@loadPercentageDecimal)->
	debug "onLoadProgress: #{@loadPercentageDecimal}"
	@player_.trigger "timeupdate"

###
Callback for Soundcloud's SEEK event after seeking is done.

@param {Number= currentPositionMs} Where soundcloud seeked to
###
videojs.Soundcloud::onSeek = (currentPositionMs)->
	debug "soundcloud seek callback"
	@currentPositionSeconds = currentPositionMs / 1000
	@player_.trigger "seeked"

###
Callback for Soundcloud's PLAY event.
It should keep track of the player's paused and playing status.
###
videojs.Soundcloud::onPlay = ->
	debug "onPlay"
	@paused_ = false
	@playing = not @paused_
	@player_.trigger "play"

###
Callback for Soundcloud's PAUSE event.
It should keep track of the player's paused and playing status.
###
videojs.Soundcloud::onPause = ->
	debug "onPause"
	@paused_ = true
	@playing = not @paused_
	@player_.trigger "pause"

###
Callback for Soundcloud's FINISHED event.
It should keep track of the player's paused and playing status.
###
videojs.Soundcloud::onFinished = ->
	@paused_ = false # TODO what does videojs expect here?
	@playing = not @paused_
	@player_.trigger "ended"

###
Callback for Soundcloud's ERROR event.
Sadly soundlcoud doesn't send any information on what happened when using the widget API --> no error message.
###
videojs.Soundcloud::onError = ->
	@player_.error("There was a soundcloud error. Check the view.")
