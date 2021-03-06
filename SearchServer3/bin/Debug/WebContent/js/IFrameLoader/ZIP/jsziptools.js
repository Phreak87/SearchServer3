 /*!
 * jsziptools.js 2.4.4 - MIT License. https://github.com/ukyo/jsziptools/blob/master/LICENSE
 * ES6-Promises - MIT License. https://github.com/jakearchibald/es6-promise/blob/master/LICENSE
 */
;
(function() {
    !function() {
        var a, b, c, d;
        !function() {
            var e = {}, f = {};
            a = function(a, b, c) {
                e[a] = {deps: b,callback: c}
            }, d = c = b = function(a) {
                function c(b) {
                    if ("." !== b.charAt(0))
                        return b;
                    for (var c = b.split("/"), d = a.split("/").slice(0, -1), e = 0, f = c.length; f > e; e++) {
                        var g = c[e];
                        if (".." === g)
                            d.pop();
                        else {
                            if ("." === g)
                                continue;
                            d.push(g)
                        }
                    }
                    return d.join("/")
                }
                if (d._eak_seen = e, f[a])
                    return f[a];
                if (f[a] = {}, !e[a])
                    throw new Error("Could not find module " + a);
                for (var g, h = e[a], i = h.deps, j = h.callback, k = [], l = 0, m = i.length; m > l; l++)
                    "exports" === i[l] ? k.push(g = {}) : k.push(b(c(i[l])));
                var n = j.apply(this, k);
                return f[a] = g || n
            }
        }(), a("promise/all", ["./utils", "exports"], function(a, b) {
            "use strict";
            function c(a) {
                var b = this;
                if (!d(a))
                    throw new TypeError("You must pass an array to all.");
                return new b(function(b, c) {
                    function d(a) {
                        return function(b) {
                            f(a, b)
                        }
                    }
                    function f(a, c) {
                        h[a] = c, 0 === --i && b(h)
                    }
                    var g, h = [], i = a.length;
                    0 === i && b([]);
                    for (var j = 0; j < a.length; j++)
                        g = a[j], g && e(g.then) ? g.then(d(j), c) : f(j, g)
                })
            }
            var d = a.isArray, e = a.isFunction;
            b.all = c
        }), a("promise/asap", ["exports"], function(a) {
            "use strict";
            function b() {
                return function() {
                    process.nextTick(e)
                }
            }
            function c() {
                var a = 0, b = new i(e), c = document.createTextNode("");
                return b.observe(c, {characterData: !0}), function() {
                    c.data = a = ++a % 2
                }
            }
            function d() {
                return function() {
                    j.setTimeout(e, 1)
                }
            }
            function e() {
                for (var a = 0; a < k.length; a++) {
                    var b = k[a], c = b[0], d = b[1];
                    c(d)
                }
                k = []
            }
            function f(a, b) {
                var c = k.push([a, b]);
                1 === c && g()
            }
            var g, h = "undefined" != typeof window ? window : {}, i = h.MutationObserver || h.WebKitMutationObserver, j = "undefined" != typeof global ? global : void 0 === this ? window : this, k = [];
            g = "undefined" != typeof process && "[object process]" === {}.toString.call(process) ? b() : i ? c() : d(), a.asap = f
        }), a("promise/config", ["exports"], function(a) {
            "use strict";
            function b(a, b) {
                return 2 !== arguments.length ? c[a] : (c[a] = b, void 0)
            }
            var c = {instrument: !1};
            a.config = c, a.configure = b
        }), a("promise/polyfill", ["./promise", "./utils", "exports"], function(a, b, c) {
            "use strict";
            function d() {
                var a;
                a = "undefined" != typeof global ? global : "undefined" != typeof window && window.document ? window : self;
                var b = "Promise" in a && "resolve" in a.Promise && "reject" in a.Promise && "all" in a.Promise && "race" in a.Promise && function() {
                    var b;
                    return new a.Promise(function(a) {
                        b = a
                    }), f(b)
                }();
                b || (a.Promise = e)
            }
            var e = a.Promise, f = b.isFunction;
            c.polyfill = d
        }), a("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function(a, b, c, d, e, f, g, h) {
            "use strict";
            function i(a) {
                if (!v(a))
                    throw new TypeError("You must pass a resolver function as the first argument to the promise constructor");
                if (!(this instanceof i))
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                this._subscribers = [], j(a, this)
            }
            function j(a, b) {
                function c(a) {
                    o(b, a)
                }
                function d(a) {
                    q(b, a)
                }
                try {
                    a(c, d)
                } catch (e) {
                    d(e)
                }
            }
            function k(a, b, c, d) {
                var e, f, g, h, i = v(c);
                if (i)
                    try {
                        e = c(d), g = !0
                    } catch (j) {
                        h = !0, f = j
                    }
                else
                    e = d, g = !0;
                n(b, e) || (i && g ? o(b, e) : h ? q(b, f) : a === D ? o(b, e) : a === E && q(b, e))
            }
            function l(a, b, c, d) {
                var e = a._subscribers, f = e.length;
                e[f] = b, e[f + D] = c, e[f + E] = d
            }
            function m(a, b) {
                for (var c, d, e = a._subscribers, f = a._detail, g = 0; g < e.length; g += 3)
                    c = e[g], d = e[g + b], k(b, c, d, f);
                a._subscribers = null
            }
            function n(a, b) {
                var c, d = null;
                try {
                    if (a === b)
                        throw new TypeError("A promises callback cannot return that same promise.");
                    if (u(b) && (d = b.then, v(d)))
                        return d.call(b, function(d) {
                            return c ? !0 : (c = !0, b !== d ? o(a, d) : p(a, d), void 0)
                        }, function(b) {
                            return c ? !0 : (c = !0, q(a, b), void 0)
                        }), !0
                } catch (e) {
                    return c ? !0 : (q(a, e), !0)
                }
                return !1
            }
            function o(a, b) {
                a === b ? p(a, b) : n(a, b) || p(a, b)
            }
            function p(a, b) {
                a._state === B && (a._state = C, a._detail = b, t.async(r, a))
            }
            function q(a, b) {
                a._state === B && (a._state = C, a._detail = b, t.async(s, a))
            }
            function r(a) {
                m(a, a._state = D)
            }
            function s(a) {
                m(a, a._state = E)
            }
            var t = a.config, u = (a.configure, b.objectOrFunction), v = b.isFunction, w = (b.now, c.all), x = d.race, y = e.resolve, z = f.reject, A = g.asap;
            t.async = A;
            var B = void 0, C = 0, D = 1, E = 2;
            i.prototype = {constructor: i,_state: void 0,_detail: void 0,_subscribers: void 0,then: function(a, b) {
                    var c = this, d = new this.constructor(function() {
                    });
                    if (this._state) {
                        var e = arguments;
                        t.async(function() {
                            k(c._state, d, e[c._state - 1], c._detail)
                        })
                    } else
                        l(this, d, a, b);
                    return d
                },"catch": function(a) {
                    return this.then(null, a)
                }}, i.all = w, i.race = x, i.resolve = y, i.reject = z, h.Promise = i
        }), a("promise/race", ["./utils", "exports"], function(a, b) {
            "use strict";
            function c(a) {
                var b = this;
                if (!d(a))
                    throw new TypeError("You must pass an array to race.");
                return new b(function(b, c) {
                    for (var d, e = 0; e < a.length; e++)
                        d = a[e], d && "function" == typeof d.then ? d.then(b, c) : b(d)
                })
            }
            var d = a.isArray;
            b.race = c
        }), a("promise/reject", ["exports"], function(a) {
            "use strict";
            function b(a) {
                var b = this;
                return new b(function(b, c) {
                    c(a)
                })
            }
            a.reject = b
        }), a("promise/resolve", ["exports"], function(a) {
            "use strict";
            function b(a) {
                if (a && "object" == typeof a && a.constructor === this)
                    return a;
                var b = this;
                return new b(function(b) {
                    b(a)
                })
            }
            a.resolve = b
        }), a("promise/utils", ["exports"], function(a) {
            "use strict";
            function b(a) {
                return c(a) || "object" == typeof a && null !== a
            }
            function c(a) {
                return "function" == typeof a
            }
            function d(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            }
            var e = Date.now || function() {
                return (new Date).getTime()
            };
            a.objectOrFunction = b, a.isFunction = c, a.isArray = d, a.now = e
        }), b("promise/polyfill").polyfill()
    }();
    function expose(a, b) {
        var c = a.split("."), d = c.pop(), e = global;
        c.forEach(function(a) {
            e[a] = e[a] || {}, e = e[a]
        }), e[d] = b
    }
    function exposeProperty(a, b, c) {
        b.prototype[a] = c
    }
    function defun(a, b) {
        return function() {
            var c, d = arguments[0];
            return c = "[object Object]" === Object.prototype.toString.call(d) ? a.map(function(a) {
                return d[a]
            }) : arguments, b.apply(this, c)
        }
    }
    function setZlibBackend(a) {
        zlibBackend.deflate = a.deflate, zlibBackend.inflate = a.inflate, zlibBackend.rawDeflate = a.rawDeflate, zlibBackend.rawInflate = a.rawInflate, a.stream && (zlibBackend.stream.deflate = a.stream.deflate, zlibBackend.stream.inflate = a.stream.infalte, zlibBackend.stream.rawDeflate = a.stream.rawDeflate, zlibBackend.stream.rawInflate = a.stream.rawInflate)
    }
    function createLocalFileHeader(a, b, c) {
        var d = new DataView(new ArrayBuffer(30 + a.length)), e = new Uint8Array(d.buffer), f = 0;
        return d.setUint32(f, zip.LOCAL_FILE_SIGNATURE, !0), f += 4, d.setUint16(f, 20, !0), f += 2, d.setUint16(f, 8), f += 2, d.setUint16(f, c ? 8 : 0, !0), f += 2, d.setUint16(f, createDosFileTime(b), !0), f += 2, d.setUint16(f, createDosFileDate(b), !0), f += 2, f += 12, d.setUint16(f, a.length, !0), f += 2, f += 2, e.set(a, f), e
    }
    function createCentralDirHeader(a, b, c, d, e, f, g) {
        var h = new DataView(new ArrayBuffer(46 + a.length)), i = new Uint8Array(h.buffer), j = 0;
        return h.setUint32(j, zip.CENTRAL_DIR_SIGNATURE, !0), j += 4, h.setUint16(j, 20, !0), j += 2, h.setUint16(j, 20, !0), j += 2, h.setUint16(j, 8), j += 2, h.setUint16(j, c ? 8 : 0, !0), j += 2, h.setUint16(j, createDosFileTime(b), !0), j += 2, h.setUint16(j, createDosFileDate(b), !0), j += 2, h.setUint32(j, g, !0), j += 4, h.setUint32(j, f, !0), j += 4, h.setUint32(j, e, !0), j += 4, h.setUint16(j, a.length, !0), j += 2, j += 12, h.setUint32(j, d, !0), j += 4, i.set(a, j), i
    }
    function createEndCentDirHeader(a, b, c) {
        var d = new DataView(new ArrayBuffer(22));
        return d.setUint32(0, zip.END_SIGNATURE, !0), d.setUint16(4, 0, !0), d.setUint16(6, 0, !0), d.setUint16(8, a, !0), d.setUint16(10, a, !0), d.setUint32(12, b, !0), d.setUint32(16, c, !0), d.setUint16(20, 0, !0), new Uint8Array(d.buffer)
    }
    function createDosFileDate(a) {
        return a.getFullYear() - 1980 << 9 | a.getMonth() + 1 << 5 | a.getDay()
    }
    function createDosFileTime(a) {
        return a.getHours() << 11 | a.getMinutes() << 5 | a.getSeconds() >> 1
    }
    var utils = {}, algorithms = {}, gz = {}, zip = {}, env = {}, zpipe = {}, stream = {algorithms: {},zlib: {},gz: {},zip: {}}, zlibBackend = {stream: {}}, global = this;
    zip.LOCAL_FILE_SIGNATURE = 67324752, zip.CENTRAL_DIR_SIGNATURE = 33639248, zip.END_SIGNATURE = 101010256, env.isWorker = "function" == typeof importScripts, expose("jz.algos", algorithms), expose("jz.stream.algos", stream.algorithms), expose("jz.setZlibBackend", setZlibBackend);
    var mimetypes = function() {
        var a = "application/epub+zip	epub\napplication/x-gzip	gz\napplication/andrew-inset	ez\napplication/annodex	anx\napplication/atom+xml	atom\napplication/atomcat+xml	atomcat\napplication/atomserv+xml	atomsrv\napplication/bbolin	lin\napplication/cap	cap pcap\napplication/cu-seeme	cu\napplication/davmount+xml	davmount\napplication/dsptype	tsp\napplication/ecmascript	es\napplication/futuresplash	spl\napplication/hta	hta\napplication/java-archive	jar\napplication/java-serialized-object	ser\napplication/java-vm	class\napplication/javascript	js\napplication/json	json\napplication/m3g	m3g\napplication/mac-binhex40	hqx\napplication/mac-compactpro	cpt\napplication/mathematica	nb nbp\napplication/msaccess	mdb\napplication/msword	doc dot\napplication/mxf	mxf\napplication/octet-stream	bin\napplication/oda	oda\napplication/ogg	ogx\napplication/onenote	one onetoc2 onetmp onepkg\napplication/pdf	pdf\napplication/pgp-keys	key\napplication/pgp-signature	pgp\napplication/pics-rules	prf\napplication/postscript	ps ai eps epsi epsf eps2 eps3\napplication/rar	rar\napplication/rdf+xml	rdf\napplication/rss+xml	rss\napplication/rtf	rtf\napplication/sla	stl\napplication/smil	smi smil\napplication/xhtml+xml	xhtml xht\napplication/xml	xml xsl xsd\napplication/xspf+xml	xspf\napplication/zip	zip\napplication/vnd.android.package-archive	apk\napplication/vnd.cinderella	cdy\napplication/vnd.google-earth.kml+xml	kml\napplication/vnd.google-earth.kmz	kmz\napplication/vnd.mozilla.xul+xml	xul\napplication/vnd.ms-excel	xls xlb xlt\napplication/vnd.ms-excel.addin.macroEnabled.12	xlam\napplication/vnd.ms-excel.sheet.binary.macroEnabled.12	xlsb\napplication/vnd.ms-excel.sheet.macroEnabled.12	xlsm\napplication/vnd.ms-excel.template.macroEnabled.12	xltm\napplication/vnd.ms-officetheme	thmx\napplication/vnd.ms-pki.seccat	cat\napplication/vnd.ms-powerpoint	ppt pps\napplication/vnd.ms-powerpoint.addin.macroEnabled.12	ppam\napplication/vnd.ms-powerpoint.presentation.macroEnabled.12	pptm\napplication/vnd.ms-powerpoint.slide.macroEnabled.12	sldm\napplication/vnd.ms-powerpoint.slideshow.macroEnabled.12	ppsm\napplication/vnd.ms-powerpoint.template.macroEnabled.12	potm\napplication/vnd.ms-word.document.macroEnabled.12	docm\napplication/vnd.ms-word.template.macroEnabled.12	dotm\napplication/vnd.oasis.opendocument.chart	odc\napplication/vnd.oasis.opendocument.database	odb\napplication/vnd.oasis.opendocument.formula	odf\napplication/vnd.oasis.opendocument.graphics	odg\napplication/vnd.oasis.opendocument.graphics-template	otg\napplication/vnd.oasis.opendocument.image	odi\napplication/vnd.oasis.opendocument.presentation	odp\napplication/vnd.oasis.opendocument.presentation-template	otp\napplication/vnd.oasis.opendocument.spreadsheet	ods\napplication/vnd.oasis.opendocument.spreadsheet-template	ots\napplication/vnd.oasis.opendocument.text	odt\napplication/vnd.oasis.opendocument.text-master	odm\napplication/vnd.oasis.opendocument.text-template	ott\napplication/vnd.oasis.opendocument.text-web	oth\napplication/vnd.openxmlformats-officedocument.presentationml.presentation	pptx\napplication/vnd.openxmlformats-officedocument.presentationml.slide	sldx\napplication/vnd.openxmlformats-officedocument.presentationml.slideshow	ppsx\napplication/vnd.openxmlformats-officedocument.presentationml.template	potx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet	xlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.sheet	xlsx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template	xltx\napplication/vnd.openxmlformats-officedocument.spreadsheetml.template	xltx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.document	docx\napplication/vnd.openxmlformats-officedocument.wordprocessingml.template	dotx\napplication/vnd.rim.cod	cod\napplication/vnd.smaf	mmf\napplication/vnd.stardivision.calc	sdc\napplication/vnd.stardivision.chart	sds\napplication/vnd.stardivision.draw	sda\napplication/vnd.stardivision.impress	sdd\napplication/vnd.stardivision.math	sdf\napplication/vnd.stardivision.writer	sdw\napplication/vnd.stardivision.writer-global	sgl\napplication/vnd.sun.xml.calc	sxc\napplication/vnd.sun.xml.calc.template	stc\napplication/vnd.sun.xml.draw	sxd\napplication/vnd.sun.xml.draw.template	std\napplication/vnd.sun.xml.impress	sxi\napplication/vnd.sun.xml.impress.template	sti\napplication/vnd.sun.xml.math	sxm\napplication/vnd.sun.xml.writer	sxw\napplication/vnd.sun.xml.writer.global	sxg\napplication/vnd.sun.xml.writer.template	stw\napplication/vnd.symbian.install	sis\napplication/vnd.visio	vsd\napplication/vnd.wap.wbxml	wbxml\napplication/vnd.wap.wmlc	wmlc\napplication/vnd.wap.wmlscriptc	wmlsc\napplication/vnd.wordperfect	wpd\napplication/vnd.wordperfect5.1	wp5\napplication/x-123	wk\napplication/x-7z-compressed	7z\napplication/x-abiword	abw\napplication/x-apple-diskimage	dmg\napplication/x-bcpio	bcpio\napplication/x-bittorrent	torrent\napplication/x-cab	cab\napplication/x-cbr	cbr\napplication/x-cbz	cbz\napplication/x-cdf	cdf cda\napplication/x-cdlink	vcd\napplication/x-chess-pgn	pgn\napplication/x-comsol	mph\napplication/x-cpio	cpio\napplication/x-csh	csh\napplication/x-debian-package	deb udeb\napplication/x-director	dcr dir dxr\napplication/x-dms	dms\napplication/x-doom	wad\napplication/x-dvi	dvi\napplication/x-font	pfa pfb gsf pcf pcf.Z\napplication/x-freemind	mm\napplication/x-futuresplash	spl\napplication/x-ganttproject	gan\napplication/x-gnumeric	gnumeric\napplication/x-go-sgf	sgf\napplication/x-graphing-calculator	gcf\napplication/x-gtar	gtar\napplication/x-gtar-compressed	tgz taz\napplication/x-hdf	hdf\napplication/x-httpd-eruby	rhtml\napplication/x-httpd-php	phtml pht php\napplication/x-httpd-php-source	phps\napplication/x-httpd-php3	php3\napplication/x-httpd-php3-preprocessed	php3p\napplication/x-httpd-php4	php4\napplication/x-httpd-php5	php5\napplication/x-ica	ica\napplication/x-info	info\napplication/x-internet-signup	ins isp\napplication/x-iphone	iii\napplication/x-iso9660-image	iso\napplication/x-jam	jam\napplication/x-java-jnlp-file	jnlp\napplication/x-jmol	jmz\napplication/x-kchart	chrt\napplication/x-killustrator	kil\napplication/x-koan	skp skd skt skm\napplication/x-kpresenter	kpr kpt\napplication/x-kspread	ksp\napplication/x-kword	kwd kwt\napplication/x-latex	latex\napplication/x-lha	lha\napplication/x-lyx	lyx\napplication/x-lzh	lzh\napplication/x-lzx	lzx\napplication/x-maker	frm maker frame fm fb book fbdoc\napplication/x-mif	mif\napplication/x-mpegURL	m3u8\napplication/x-ms-wmd	wmd\napplication/x-ms-wmz	wmz\napplication/x-msdos-program	com exe bat dll\napplication/x-msi	msi\napplication/x-netcdf	nc\napplication/x-ns-proxy-autoconfig	pac dat\napplication/x-nwc	nwc\napplication/x-object	o\napplication/x-oz-application	oza\napplication/x-pkcs7-certreqresp	p7r\napplication/x-pkcs7-crl	crl\napplication/x-python-code	pyc pyo\napplication/x-qgis	qgs shp shx\napplication/x-quicktimeplayer	qtl\napplication/x-rdp	rdp\napplication/x-redhat-package-manager	rpm\napplication/x-ruby	rb\napplication/x-scilab	sci sce\napplication/x-sh	sh\napplication/x-shar	shar\napplication/x-shockwave-flash	swf swfl\napplication/x-silverlight	scr\napplication/x-sql	sql\napplication/x-stuffit	sit sitx\napplication/x-sv4cpio	sv4cpio\napplication/x-sv4crc	sv4crc\napplication/x-tar	tar\napplication/x-tcl	tcl\napplication/x-tex-gf	gf\napplication/x-tex-pk	pk\napplication/x-texinfo	texinfo texi\napplication/x-trash	~ % bak old sik\napplication/x-troff	t tr roff\napplication/x-troff-man	man\napplication/x-troff-me	me\napplication/x-troff-ms	ms\napplication/x-ustar	ustar\napplication/x-wais-source	src\napplication/x-wingz	wz\napplication/x-x509-ca-cert	crt\napplication/x-xcf	xcf\napplication/x-xfig	fig\napplication/x-xpinstall	xpi\naudio/amr	amr\naudio/amr-wb	awb\naudio/amr	amr\naudio/amr-wb	awb\naudio/annodex	axa\naudio/basic	au snd\naudio/csound	csd orc sco\naudio/flac	flac\naudio/midi	mid midi kar\naudio/mpeg	mpga mpega mp2 mp3 m4a\naudio/mpegurl	m3u\naudio/ogg	oga ogg spx\naudio/prs.sid	sid\naudio/x-aiff	aif aiff aifc\naudio/x-gsm	gsm\naudio/x-mpegurl	m3u\naudio/x-ms-wma	wma\naudio/x-ms-wax	wax\naudio/x-pn-realaudio	ra rm ram\naudio/x-realaudio	ra\naudio/x-scpls	pls\naudio/x-sd2	sd2\naudio/x-wav	wav\nchemical/x-alchemy	alc\nchemical/x-cache	cac cache\nchemical/x-cache-csf	csf\nchemical/x-cactvs-binary	cbin cascii ctab\nchemical/x-cdx	cdx\nchemical/x-cerius	cer\nchemical/x-chem3d	c3d\nchemical/x-chemdraw	chm\nchemical/x-cif	cif\nchemical/x-cmdf	cmdf\nchemical/x-cml	cml\nchemical/x-compass	cpa\nchemical/x-crossfire	bsd\nchemical/x-csml	csml csm\nchemical/x-ctx	ctx\nchemical/x-cxf	cxf cef\nchemical/x-embl-dl-nucleotide	emb embl\nchemical/x-galactic-spc	spc\nchemical/x-gamess-input	inp gam gamin\nchemical/x-gaussian-checkpoint	fch fchk\nchemical/x-gaussian-cube	cub\nchemical/x-gaussian-input	gau gjc gjf\nchemical/x-gaussian-log	gal\nchemical/x-gcg8-sequence	gcg\nchemical/x-genbank	gen\nchemical/x-hin	hin\nchemical/x-isostar	istr ist\nchemical/x-jcamp-dx	jdx dx\nchemical/x-kinemage	kin\nchemical/x-macmolecule	mcm\nchemical/x-macromodel-input	mmd mmod\nchemical/x-mdl-molfile	mol\nchemical/x-mdl-rdfile	rd\nchemical/x-mdl-rxnfile	rxn\nchemical/x-mdl-sdfile	sd sdf\nchemical/x-mdl-tgf	tgf\nchemical/x-mmcif	mcif\nchemical/x-mol2	mol2\nchemical/x-molconn-Z	b\nchemical/x-mopac-graph	gpt\nchemical/x-mopac-input	mop mopcrt mpc zmt\nchemical/x-mopac-out	moo\nchemical/x-mopac-vib	mvb\nchemical/x-ncbi-asn1	asn\nchemical/x-ncbi-asn1-ascii	prt ent\nchemical/x-ncbi-asn1-binary	val aso\nchemical/x-ncbi-asn1-spec	asn\nchemical/x-pdb	pdb ent\nchemical/x-rosdal	ros\nchemical/x-swissprot	sw\nchemical/x-vamas-iso14976	vms\nchemical/x-vmd	vmd\nchemical/x-xtel	xtel\nchemical/x-xyz	xyz\nimage/gif	gif\nimage/ief	ief\nimage/jpeg	jpeg jpg jpe\nimage/pcx	pcx\nimage/png	png\nimage/svg+xml	svg svgz\nimage/tiff	tiff tif\nimage/vnd.djvu	djvu djv\nimage/vnd.wap.wbmp	wbmp\nimage/x-canon-cr2	cr2\nimage/x-canon-crw	crw\nimage/x-cmu-raster	ras\nimage/x-coreldraw	cdr\nimage/x-coreldrawpattern	pat\nimage/x-coreldrawtemplate	cdt\nimage/x-corelphotopaint	cpt\nimage/x-epson-erf	erf\nimage/x-icon	ico\nimage/x-jg	art\nimage/x-jng	jng\nimage/x-ms-bmp	bmp\nimage/x-nikon-nef	nef\nimage/x-olympus-orf	orf\nimage/x-photoshop	psd\nimage/x-portable-anymap	pnm\nimage/x-portable-bitmap	pbm\nimage/x-portable-graymap	pgm\nimage/x-portable-pixmap	ppm\nimage/x-rgb	rgb\nimage/x-xbitmap	xbm\nimage/x-xpixmap	xpm\nimage/x-xwindowdump	xwd\nmessage/rfc822	eml\nmodel/iges	igs iges\nmodel/mesh	msh mesh silo\nmodel/vrml	wrl vrml\nmodel/x3d+vrml	x3dv\nmodel/x3d+xml	x3d\nmodel/x3d+binary	x3db\ntext/cache-manifest	manifest\ntext/calendar	ics icz\ntext/css	css\ntext/csv	csv\ntext/h323	323\ntext/html	html htm shtml\ntext/iuls	uls\ntext/mathml	mml\ntext/plain	asc txt text pot brf\ntext/richtext	rtx\ntext/scriptlet	sct wsc\ntext/texmacs	tm\ntext/tab-separated-values	tsv\ntext/vnd.sun.j2me.app-descriptor	jad\ntext/vnd.wap.wml	wml\ntext/vnd.wap.wmlscript	wmls\ntext/x-bibtex	bib\ntext/x-boo	boo\ntext/x-c++hdr	h++ hpp hxx hh\ntext/x-c++src	c++ cpp cxx cc\ntext/x-chdr	h\ntext/x-component	htc\ntext/x-csh	csh\ntext/x-csrc	c\ntext/x-dsrc	d\ntext/x-diff	diff patch\ntext/x-haskell	hs\ntext/x-java	java\ntext/x-literate-haskell	lhs\ntext/x-moc	moc\ntext/x-pascal	p pas\ntext/x-pcs-gcd	gcd\ntext/x-perl	pl pm\ntext/x-python	py\ntext/x-scala	scala\ntext/x-setext	etx\ntext/x-sfv	sfv\ntext/x-sh	sh\ntext/x-tcl	tcl tk\ntext/x-tex	tex ltx sty cls\ntext/x-vcalendar	vcs\ntext/x-vcard	vcf\nvideo/3gpp	3gp\nvideo/annodex	axv\nvideo/dl	dl\nvideo/dv	dif dv\nvideo/fli	fli\nvideo/gl	gl\nvideo/mpeg	mpeg mpg mpe\nvideo/MP2T	ts\nvideo/mp4	mp4\nvideo/quicktime	qt mov\nvideo/ogg	ogv\nvideo/webm	webm\nvideo/vnd.mpegurl	mxu\nvideo/x-flv	flv\nvideo/x-la-asf	lsf lsx\nvideo/x-mng	mng\nvideo/x-ms-asf	asf asx\nvideo/x-ms-wm	wm\nvideo/x-ms-wmv	wmv\nvideo/x-ms-wmx	wmx\nvideo/x-ms-wvx	wvx\nvideo/x-msvideo	avi\nvideo/x-sgi-movie	movie\nvideo/x-matroska	mpv mkv\nx-conference/x-cooltalk	ice\nx-epoc/x-sisx-app	sisx\nx-world/x-vrml	vrm vrml wrl", b = a.split("\n"), c = {};
        return b.forEach(function(a) {
            var b = a.split("	"), d = b[0], e = b[1].split(" ");
            e.forEach(function(a) {
                c[a] = d
            })
        }), {set: function(a, b) {
                "object" == typeof a ? Object.keys(a).forEach(function(b) {
                    c[b] = a[b]
                }) : c[a] = b
            },guess: function(a) {
                return c[a.split(".").pop()] || "aplication/octet-stream"
            }}
    }();
    utils.toArray = function(a) {
        return Array.prototype.slice.call(a)
    }, utils.getParams = function(a, b) {
        if ("[object Object]" === Object.prototype.toString.call(a[0]))
            return a[0];
        var c = {};
        return b.forEach(function(b, d) {
            c[b] = a[d]
        }), c
    }, utils.toBytes = function(a) {
        switch (Object.prototype.toString.call(a)) {
            case "[object String]":
                return utils.stringToBytes(a);
            case "[object Array]":
            case "[object ArrayBuffer]":
                return new Uint8Array(a);
            case "[object Uint8Array]":
                return a;
            case "[object Int8Array]":
            case "[object Uint8ClampedArray]":
            case "[object CanvasPixelArray]":
                return new Uint8Array(a.buffer, a.byteOffset, a.byteLength);
            default:
                throw new Error("jz.utils.toBytes: not supported type.")
        }
    }, expose("jz.utils.toBytes", utils.toBytes), utils.readFileAs = function(a, b, c) {
        var d;
        return d = env.isWorker ? function(d) {
            var e = new FileReaderSync;
            d(e["readAs" + a].call(e, b, c))
        } : function(d, e) {
            var f = new FileReader;
            f.onload = function() {
                d(f.result)
            }, f.onerror = e, f["readAs" + a].call(f, b, c)
        }, new Promise(d)
    }, utils.readFileAsText = function(a, b) {
        return utils.readFileAs("Text", a, b || "UTF-8")
    }, utils.readFileAsArrayBuffer = utils.readFileAs.bind(null, "ArrayBuffer"), utils.readFileAsDataURL = utils.readFileAs.bind(null, "DataURL"), utils.readFileAsBinaryString = utils.readFileAs.bind(null, "BinaryString"), expose("jz.utils.readFileAsArrayBuffer", utils.readFileAsArrayBuffer), expose("jz.utils.readFileAsText", utils.readFileAsText), expose("jz.utils.readFileAsDataURL", utils.readFileAsDataURL), expose("jz.utils.readFileAsBinaryString", utils.readFileAsBinaryString), utils.stringToBytes = function(a) {
        var b, c, d, e = a.length, f = -1, g = 32, h = new Uint8Array(g);
        for (b = 0; e > b; ++b)
            c = a.charCodeAt(b), 127 >= c ? h[++f] = c : 2047 >= c ? (h[++f] = 192 | c >>> 6, h[++f] = 128 | 63 & c) : 65535 >= c ? (h[++f] = 224 | c >>> 12, h[++f] = 128 | c >>> 6 & 63, h[++f] = 128 | 63 & c) : (h[++f] = 240 | c >>> 18, h[++f] = 128 | c >>> 12 & 63, h[++f] = 128 | c >>> 6 & 63, h[++f] = 128 | 63 & c), 4 >= g - f && (d = h, g *= 2, h = new Uint8Array(g), h.set(d));
        return h.subarray(0, ++f)
    }, utils.bytesToString = function(a, b) {
        return utils.readFileAsText(new Blob([utils.toBytes(a)]), b)
    }, expose("jz.utils.bytesToString", utils.bytesToString), utils.bytesToStringSync = null, env.isWorker && (utils.bytesToStringSync = function(a, b) {
        return (new FileReaderSync).readAsText(new Blob([utils.toBytes(a)]), b || "UTF-8")
    }, expose("jz.utils.bytesToStringSync", utils.bytesToStringSync)), utils.detectEncoding = function(a) {
        a = utils.toBytes(a);
        for (var b = 0, c = a.length; c > b; ++b)
            if (!(a[b] < 128))
                if (192 === (224 & a[b])) {
                    if (128 === (192 & a[++b]))
                        continue
                } else if (224 === (240 & a[b])) {
                    if (128 === (192 & a[++b]) && 128 === (192 & a[++b]))
                        continue
                } else {
                    if (240 !== (248 & a[b]))
                        return "Shift_JIS";
                    if (128 === (192 & a[++b]) && 128 === (192 & a[++b]) && 128 === (192 & a[++b]))
                        continue
                }
        return "UTF-8"
    }, expose("jz.utils.detectEncoding", utils.detectEncoding), Promise.prototype.spread = function(a, b) {
        return Promise.prototype.then.call(this, Function.prototype.apply.bind(a, null), b)
    }, utils.load = function(a) {
        return a = Array.isArray(a) ? a : utils.toArray(arguments), Promise.all(a.map(function(a) {
            return new Promise(function(b, c) {
                var d = new XMLHttpRequest;
                d.open("GET", a), d.responseType = "arraybuffer", d.onloadend = function() {
                    var e = d.status;
                    200 === e || 206 === e || 0 === e ? b(new Uint8Array(d.response)) : c(new Error("Load Error: " + e + " " + a))
                }, d.onerror = c, d.send()
            })
        }))
    }, expose("jz.utils.load", utils.load), utils.concatBytes = function(a) {
        var b, c, d, e = 0, f = 0;
        for (a = Array.isArray(a) ? a : utils.toArray(arguments), b = 0, c = a.length; c > b; ++b)
            e += a[b].length;
        for (d = new Uint8Array(e), b = 0; c > b; ++b)
            d.set(a[b], f), f += a[b].length;
        return d
    }, expose("jz.utils.concatBytes", utils.concatBytes), algorithms.adler32 = function(a) {
        a = utils.toBytes(a);
        for (var b, c = 1, d = 0, e = 0, f = 65521, g = a.length; g > 0; ) {
            b = g > 5550 ? 5550 : g, g -= b;
            do
                c += a[e++], d += c;
            while (--b);
            c %= f, d %= f
        }
        return (d << 16 | c) >>> 0
    }, expose("jz.algorithms.adler32", algorithms.adler32), algorithms.crc32 = function() {
        var a = function() {
            var a, b, c, d = 3988292384, e = new Uint32Array(256);
            for (b = 0; 256 > b; ++b) {
                for (a = b, c = 0; 8 > c; ++c)
                    a = 1 & a ? a >>> 1 ^ d : a >>> 1;
                e[b] = a >>> 0
            }
            return e
        }();
        return defun(["buffer", "crc"], function(b, c) {
            for (var d = utils.toBytes(b), c = null == c ? 4294967295 : ~c >>> 0, e = 0, f = d.length, g = a; f > e; ++e)
                c = c >>> 8 ^ g[d[e] ^ 255 & c];
            return ~c >>> 0
        })
    }(), expose("jz.algorithms.crc32", algorithms.crc32), algorithms.deflate = defun(["buffer", "level", "chunkSize"], function(a, b, c) {
        return zlibBackend.rawDeflate(utils.toBytes(a), b, c)
    }), expose("jz.algorithms.deflate", algorithms.deflate), algorithms.inflate = defun(["buffer", "chunkSize"], function(a, b) {
        return zlibBackend.rawInflate(utils.toBytes(a), b)
    }), expose("jz.algorithms.inflate", algorithms.inflate);
    var ZipArchiveWriter = defun(["shareMemory", "chunkSize"], function(a, b) {
        this.shareMemory = a, this.chunkSize = b, this.dirs = {}, this.centralDirHeaders = [], this.offset = 0, this.date = new Date, this.listners = {}
    });
    ZipArchiveWriter.prototype.write = function(a, b, c) {
        var d = this;
        return a.split("/").reduce(function(a, b) {
            return d.writeDir(a + "/"), a + "/" + b
        }), this.writeFile(a, b, c), this
    }, ZipArchiveWriter.prototype.writeDir = function(a) {
        var b;
        return a += /.+\/$/.test(a) ? "" : "/", this.dirs[a] || (this.dirs[a] = !0, a = utils.toBytes(a), b = createLocalFileHeader(a, this.date, !1), this.centralDirHeaders.push(createCentralDirHeader(a, this.date, !1, this.offset, 0, 0, 0)), this.trigger("data", b), this.offset += b.length), this
    }, ZipArchiveWriter.prototype.writeFile = function(a, b, c) {
        a = utils.toBytes(a);
        var d = this.offset, e = createLocalFileHeader(a, this.date, c), f = 0, g = this;
        return this.trigger("data", e), c ? stream.algorithms.deflate({buffer: b,level: c,streamFn: function(a) {
                f += a.length, g.trigger("data", a)
            },shareMemory: this.shareMemory,chunkSize: this.chunkSize}) : (f = b.length, this.trigger("data", b)), this.centralDirHeaders.push(createCentralDirHeader(a, this.date, c, d, b.length, f, algorithms.crc32(b))), this.offset += e.length + f, this
    }, ZipArchiveWriter.prototype.writeEnd = function() {
        var a = 0, b = this;
        this.centralDirHeaders.forEach(function(c) {
            a += c.length, b.trigger("data", c)
        }), this.trigger("data", createEndCentDirHeader(this.centralDirHeaders.length, a, this.offset)), this.trigger("end", null)
    }, ZipArchiveWriter.prototype.on = function(a, b) {
        return this.listners[a] || (this.listners[a] = []), this.listners[a].push(b), this
    }, ZipArchiveWriter.prototype.trigger = function(a, b) {
        this.listners[a] && this.listners[a].forEach(function(a) {
            a(b)
        })
    }, expose("jz.zip.ZipArchiveWriter", ZipArchiveWriter), exposeProperty("write", ZipArchiveWriter, ZipArchiveWriter.prototype.write), exposeProperty("writeDir", ZipArchiveWriter, ZipArchiveWriter.prototype.writeDir), exposeProperty("writeFile", ZipArchiveWriter, ZipArchiveWriter.prototype.writeFile), exposeProperty("writeEnd", ZipArchiveWriter, ZipArchiveWriter.prototype.writeEnd), exposeProperty("on", ZipArchiveWriter, ZipArchiveWriter.prototype.on);
    var ZipArchiveReader = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
        this.bytes = utils.toBytes(a), this.buffer = this.bytes.buffer, this.encoding = b, this.chunkSize = c
    });
    ZipArchiveReader.prototype.init = function() {
        var a, b, c, d, e = this.bytes, f = [], g = [], h = [], i = [], j = e.byteLength - 4, k = new DataView(e.buffer, e.byteOffset, e.byteLength), l = this;
        if (this.files = h, this.folders = i, this.localFileHeaders = f, this.centralDirHeaders = g)
            throw new Error("zip.unpack: invalid zip file");
        for (; ; ) {
            if (k.getUint32(j, !0) === zip.END_SIGNATURE) {
                b = l._getEndCentDirHeader(j);
                break
            }
            if (j--, 0 === j)
                throw new Error("zip.unpack: invalid zip file")
        }
        for (j = b.startpos, c = 0, d = b.direntry; d > c; ++c)
            a = l._getCentralDirHeader(j), g.push(a), j += a.allsize;
        for (c = 0; d > c; ++c)
            j = g[c].headerpos, a = l._getLocalFileHeader(j), a.crc32 = g[c].crc32, a.compsize = g[c].compsize, a.uncompsize = g[c].uncompsize, f.push(a);
        return this._completeInit()
    }, ZipArchiveReader.prototype._completeInit = function() {
        var a, b = this.files, c = this.folders, d = this.localFileHeaders, e = this;
        return d.forEach(function(a) {
            (47 !== a.filename[a.filename.length - 1] ? b : c).push(a)
        }), a = null == e.encoding ? Promise.resolve(d.slice(0, 100).map(function(a) {
            return a.filename
        })).then(utils.concatBytes).then(utils.detectEncoding).then(function(a) {
            e.encoding = a
        }) : Promise.resolve(), a.then(function() {
            return Promise.all(d.map(function(a) {
                return utils.bytesToString(a.filename, e.encoding).then(function(b) {
                    a.filename = b
                })
            }))
        }).then(function() {
            return e
        })
    }, ZipArchiveReader.prototype._getLocalFileHeader = function(a) {
        var b = new DataView(this.buffer, a), c = new Uint8Array(this.buffer, a), d = {};
        return d.signature = b.getUint32(0, !0), d.needver = b.getUint16(4, !0), d.option = b.getUint16(6, !0), d.comptype = b.getUint16(8, !0), d.filetime = b.getUint16(10, !0), d.filedate = b.getUint16(12, !0), d.crc32 = b.getUint32(14, !0), d.compsize = b.getUint32(18, !0), d.uncompsize = b.getUint32(22, !0), d.fnamelen = b.getUint16(26, !0), d.extralen = b.getUint16(28, !0), d.headersize = 30 + d.fnamelen + d.extralen, d.allsize = d.headersize + d.compsize, d.filename = c.subarray(30, 30 + d.fnamelen), d
    }, ZipArchiveReader.prototype._getCentralDirHeader = function(a) {
        var b = new DataView(this.buffer, a), c = {};
        return c.signature = b.getUint32(0, !0), c.madever = b.getUint16(4, !0), c.needver = b.getUint16(6, !0), c.option = b.getUint16(8, !0), c.comptype = b.getUint16(10, !0), c.filetime = b.getUint16(12, !0), c.filedate = b.getUint16(14, !0), c.crc32 = b.getUint32(16, !0), c.compsize = b.getUint32(20, !0), c.uncompsize = b.getUint32(24, !0), c.fnamelen = b.getUint16(28, !0), c.extralen = b.getUint16(30, !0), c.commentlen = b.getUint16(32, !0), c.disknum = b.getUint16(34, !0), c.inattr = b.getUint16(36, !0), c.outattr = b.getUint32(38, !0), c.headerpos = b.getUint32(42, !0), c.allsize = 46 + c.fnamelen + c.extralen + c.commentlen, c
    }, ZipArchiveReader.prototype._getEndCentDirHeader = function(a) {
        var b = new DataView(this.buffer, a);
        return {signature: b.getUint32(0, !0),disknum: b.getUint16(4, !0),startdisknum: b.getUint16(6, !0),diskdirentry: b.getUint16(8, !0),direntry: b.getUint16(10, !0),dirsize: b.getUint32(12, !0),startpos: b.getUint32(16, !0),commentlen: b.getUint16(20, !0)}
    }, ZipArchiveReader.prototype.getFileNames = function() {
        return this.files.map(function(a) {
            return a.filename
        })
    }, ZipArchiveReader.prototype._getFileIndex = function(a) {
        for (var b = 0, c = this.localFileHeaders.length; c > b; ++b)
            if (a === this.localFileHeaders[b].filename)
                return b;
        throw new Error("File is not found.")
    }, ZipArchiveReader.prototype._getFileInfo = function(a) {
        var b = this._getFileIndex(a), c = this.centralDirHeaders[b], d = this.localFileHeaders[b];
        return {offset: c.headerpos + d.headersize,length: d.compsize,isCompressed: d.comptype}
    }, ZipArchiveReader.prototype._decompress = function(a, b) {
        return b ? algorithms.inflate({buffer: a,chunkSize: this.chunkSize}) : a
    }, ZipArchiveReader.prototype._decompressFile = function(a) {
        var b = this._getFileInfo(a);
        return this._decompress(new Uint8Array(this.buffer, b.offset, b.length), b.isCompressed)
    }, ZipArchiveReader.prototype.readFileAsArrayBuffer = function(a) {
        return new Promise(function(b) {
            b(this._decompressFile(a).buffer)
        }.bind(this))
    }, ZipArchiveReader.prototype._readFileAs = function(a, b, c) {
        return this.readFileAsBlob(b).then(function(b) {
            return utils.readFileAs.call(null, a, b, c)
        })
    }, ZipArchiveReader.prototype.readFileAsText = function(a, b) {
        return this._readFileAs("Text", a, b || "UTF-8")
    }, ZipArchiveReader.prototype.readFileAsBinaryString = function(a) {
        return this._readFileAs("BinaryString", a)
    }, ZipArchiveReader.prototype.readFileAsDataURL = function(a) {
        return this._readFileAs("DataURL", a)
    }, ZipArchiveReader.prototype.readFileAsBlob = function(a, b) {
        return new Promise(function(c) {
            c(new Blob([this._decompressFile(a, !1)], {type: b || mimetypes.guess(a)}))
        }.bind(this))
    }, env.isWorker && (ZipArchiveReader.prototype.readFileAsArrayBufferSync = function(a) {
        return this._decompressFile(a, !0).buffer
    }, ZipArchiveReader.prototype.readFileAsBlobSync = function(a, b) {
        return new Blob([this._decompressFile(a, !1)], {type: b || mimetypes.guess(a)})
    }, ZipArchiveReader.prototype.readFileAsTextSync = function(a, b) {
        return (new FileReaderSync).readAsText(this.readFileAsBlobSync(a), b || "UTF-8")
    }, ZipArchiveReader.prototype.readFileAsBinaryStringSync = function(a) {
        return (new FileReaderSync).readAsBinaryString(this.readFileAsBlobSync(a))
    }, ZipArchiveReader.prototype.readFileAsDataURLSync = function(a) {
        return (new FileReaderSync).readAsDataURL(this.readFileAsBlobSync(a))
    }, exposeProperty("readFileAsArrayBufferSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsArrayBufferSync), exposeProperty("readFileAsBlobSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBlobSync), exposeProperty("readFileAsTextSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsDataURLSync)), exposeProperty("getFileNames", ZipArchiveReader, ZipArchiveReader.prototype.getFileNames), exposeProperty("readFileAsArrayBuffer", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsArrayBuffer), exposeProperty("readFileAsText", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsText), exposeProperty("readFileAsBinaryString", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBinaryString), exposeProperty("readFileAsDataURL", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsDataURL), exposeProperty("readFileAsBlob", ZipArchiveReader, ZipArchiveReader.prototype.readFileAsBlob);
    var ZipArchiveReaderBlob = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
        this.blob = a, this.encoding = b, this.chunkSize = c
    });
    ZipArchiveReaderBlob.prototype = Object.create(ZipArchiveReader.prototype), ZipArchiveReaderBlob.prototype.constructor = ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.init = function() {
        function a(a, b) {
            return utils.readFileAsArrayBuffer(c.slice(a, b))
        }
        var b, c = this.blob, d = [], e = [], f = [], g = [];
        return this.files = f, this.folders = g, this.localFileHeaders = e, this.centralDirHeaders = d, function() {
            return a(0, 4).then(function(a) {
                if (new DataView(a).getUint32(0, !0) === zip.LOCAL_FILE_SIGNATURE)
                    return Math.max(0, c.size - 32768);
                throw new Error("zip.unpack: invalid zip file.")
            })
        }().then(function h(b) {
            return a(b, Math.min(c.size, b + 32768)).then(function(a) {
                var c, d = new DataView(a);
                for (c = a.byteLength - 4; c--; )
                    if (d.getUint32(c, !0) === zip.END_SIGNATURE)
                        return b + c;
                if (b)
                    return h(Math.max(b - 32768 + 3, 0));
                throw new Error("zip.unpack: invalid zip file.")
            })
        }).then(function(d) {
            return a(d, c.size).then(function(a) {
                return b = ZipArchiveReader.prototype._getEndCentDirHeader.call({buffer: a}, 0), d
            })
        }).then(function(c) {
            return a(b.startpos, c).then(function(a) {
                var c, e, f, g = 0, h = {buffer: a};
                for (c = 0, e = b.direntry; e > c; ++c)
                    f = ZipArchiveReader.prototype._getCentralDirHeader.call(h, g), d.push(f), g += f.allsize
            })
        }).then(function i(b) {
            if (b !== d.length) {
                var c = d[b].headerpos;
                return a(c + 26, c + 30).then(function(b) {
                    var d = new DataView(b), e = d.getUint16(0, !0), f = d.getUint16(2, !0);
                    return a(c, c + 30 + e + f)
                }).then(function(a) {
                    var c = ZipArchiveReader.prototype._getLocalFileHeader.call({buffer: a}, 0);
                    return c.crc32 = d[b].crc32, c.compsize = d[b].compsize, c.uncompsize = d[b].uncompsize, e.push(c), i(b + 1)
                })
            }
        }.bind(null, 0)).then(this._completeInit.bind(this))
    }, ZipArchiveReaderBlob.prototype.readFileAsArrayBuffer = function(a) {
        return this._readFileAs("ArrayBuffer", a)
    }, ZipArchiveReaderBlob.prototype.readFileAsBlob = function(a, b) {
        b = b || mimetypes.guess(a);
        var c = this._getFileInfo(a), d = this.blob.slice(c.offset, c.offset + c.length, {type: b});
        return c.isCompressed ? utils.readFileAsArrayBuffer(d).then(function(a) {
            return new Blob([algorithms.inflate(new Uint8Array(a))], {type: b})
        }) : Promise.resolve(d)
    }, env.isWorker && (ZipArchiveReaderBlob.prototype._decompressFile = function(a) {
        var b = this._getFileInfo(a), c = this.blob.slice(b.offset, b.offset + b.length), d = new Uint8Array((new FileReaderSync).readAsArrayBuffer(c));
        return this._decompress(d, b.isCompressed)
    }, ZipArchiveReaderBlob.prototype.readFileAsArrayBufferSync = function(a) {
        return this._decompressFile(a, !0).buffer
    }, ZipArchiveReaderBlob.prototype.readFileAsBlobSync = function(a, b) {
        return new Blob([this._decompressFile(a, !1)], {type: b || mimetypes.guess(a)})
    }, exposeProperty("readFileAsArrayBufferSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsArrayBufferSync), exposeProperty("readFileAsBlobSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBlobSync), exposeProperty("readFileAsTextSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURLSync)), exposeProperty("readFileAsArrayBuffer", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsArrayBuffer), exposeProperty("readFileAsText", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsText), exposeProperty("readFileAsBinaryString", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryString), exposeProperty("readFileAsDataURL", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURL), exposeProperty("readFileAsBlob", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBlob), exposeProperty("readFileAsTextSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsTextSync), exposeProperty("readFileAsBinaryStringSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsBinaryStringSync), exposeProperty("readFileAsDataURLSync", ZipArchiveReaderBlob, ZipArchiveReaderBlob.prototype.readFileAsDataURLSync), stream.algorithms.deflate = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
        zlibBackend.stream.rawDeflate(utils.toBytes(a), b, c, d, e)
    }), expose("jz.stream.algorithms.deflate", stream.algorithms.deflate), stream.algorithms.inflate = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
        zlibBackend.stream.rawInflate(utils.toBytes(a), b, c, d)
    }), expose("jz.stream.algorithms.inflate", stream.algorithms.inflate), stream.zlib.compress = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
        zlibBackend.stream.deflate(utils.toBytes(a), b, c, d, e)
    }), expose("jz.stream.zlib.compress", stream.zlib.compress), stream.zlib.decompress = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
        zlibBackend.stream.inflate(utils.toBytes(a), b, c, d)
    }), expose("jz.stream.zlib.decompress", stream.zlib.decompress), stream.gz.compress = defun(["buffer", "streamFn", "level", "shareMemory", "chunkSize", "fname", "fcomment"], function(a, b, c, d, e, f, g) {
        var h, i, j, k = utils.toBytes(a), l = 0, m = 10, n = 0, o = Date.now();
        f = f && utils.toBytes(f), g = g && utils.toBytes(g), f && (m += f.length + 1, l |= 8), g && (m += g.length + 1, l |= 16), h = new Uint8Array(m), j = new DataView(h.buffer), j.setUint32(n, 529205248 | l), n += 4, j.setUint32(n, o, !0), n += 4, j.setUint16(n, 1279), n += 2, f && (h.set(f, n), n += f.length, h[n++] = 0), g && (h.set(g, n), n += g.length, h[n++] = 0), b(h), stream.algorithms.deflate({buffer: k,streamFn: b,shareMemory: d,chunkSize: e}), i = new Uint8Array(8), j = new DataView(i.buffer), j.setUint32(0, algorithms.crc32(k), !0), j.setUint32(4, k.length, !0), b(i)
    }), expose("jz.stream.gz.compress", stream.gz.compress), stream.gz.decompress = defun(["buffer", "streamFn", "shareMemory", "chunkSize"], function(a, b, c, d) {
        var e, f, g = utils.toBytes(a), h = 10, i = new DataView(g.buffer, g.byteOffset, g.byteLength);
        if (8075 !== i.getUint16(0))
            throw new Error("jz.gz.decompress: invalid gzip file.");
        if (8 !== g[2])
            throw new Error("jz.gz.decompress: not deflate.");
        if (e = g[3], 4 & e && (h += i.getUint16(h, !0) + 2), 8 & e)
            for (; g[h++]; )
                ;
        if (16 & e)
            for (; g[h++]; )
                ;
        if (2 & e && (h += 2), stream.algorithms.inflate({buffer: g.subarray(h, g.length - 8),streamFn: function(a) {
                f = algorithms.crc32(a, f), b(a)
            },shareMemory: c,chunkSize: d}), f !== i.getUint32(g.length - 8, !0))
            throw new Error("js.stream.gz.decompress: file is broken.")
    }), expose("jz.stream.gz.decompress", stream.gz.decompress), stream.zip.pack = defun(["files", "streamFn", "level", "shareMemory", "chunkSize"], function(a, b, c, d, e) {
        function f(a, b, c) {
            var d, e = c.children || c.dir || c.folder;
            if (a = "number" == typeof c.level ? c.level : a, e)
                b += c.name + (/.+\/$/.test(c.name) ? "" : "/"), i.writeDir(b), e.forEach(f.bind(null, a, b));
            else {
                if (null != c.buffer && (d = c.buffer), null != c.str && (d = c.str), null == d)
                    throw new Error("jz.zip.pack: This type is not supported.");
                b += c.name, i.writeFile(b, utils.toBytes(d), a)
            }
        }
        function g(a) {
            var b = a.children || a.dir || a.folder;
            b ? b.forEach(g) : a.url && h.push(utils.load(a.url).then(function(b) {
                a.buffer = b[0], a.url = null
            }))
        }
        var h = [], i = new ZipArchiveWriter(d, e);
        return c = "number" == typeof c ? c : 6, i.on("data", b), a.forEach(g), Promise.all(h).then(function() {
            a.forEach(f.bind(null, c, "")), i.writeEnd()
        })
    }), expose("jz.stream.zip.pack", stream.zip.pack), expose("jz.zlib.compress", defun(["buffer", "level", "chunkSize"], function(a, b, c) {
        return zlibBackend.deflate(utils.toBytes(a), b, c)
    })), expose("jz.zlib.decompress", defun(["buffer", "chunkSize"], function(a, b) {
        return zlibBackend.inflate(utils.toBytes(a), b)
    })), gz.compress = defun(["buffer", "level", "chunkSize", "fname", "fcomment"], function(a, b, c, d, e) {
        var f = [];
        return stream.gz.compress({buffer: a,level: b,chunkSize: c,fname: d,fcomment: e,streamFn: function(a) {
                f.push(a)
            }}), utils.concatBytes(f)
    }), expose("jz.gz.compress", gz.compress), gz.decompress = defun(["buffer", "chunkSize"], function(a, b) {
        var c = [];
        return stream.gz.decompress({buffer: a,streamFn: function(a) {
                c.push(a)
            },chunkSize: b}), utils.concatBytes(c)
    }), expose("jz.gz.decompress", gz.decompress), zip.pack = defun(["files", "level", "chunkSize"], function(a, b, c) {
        var d = [];
        return stream.zip.pack({files: a,shareMemory: !1,level: b,chunkSize: c,streamFn: function(a) {
                d.push(a)
            }}).then(function() {
            return utils.concatBytes(d)
        })
    }), expose("jz.zip.pack", zip.pack), zip.unpack = defun(["buffer", "encoding", "chunkSize"], function(a, b, c) {
        var d = a instanceof Blob ? ZipArchiveReaderBlob : ZipArchiveReader;
        return new d({buffer: a,encoding: b,chunkSize: c}).init()
    }), expose("jz.zip.unpack", zip.unpack);
    /*! zlib-asm v0.2.2 Released under the zlib license. https://github.com/ukyo/zlib-asm/LICENSE */var zlib = {};
    (function() {
        function f(a) {
            throw a;
        }
        var i = void 0, j = !0, k = null, l = !1;
        function m() {
            return function() {
            }
        }
        var p = {TOTAL_MEMORY: 8388608}, aa = {}, q;
        for (q in p)
            p.hasOwnProperty(q) && (aa[q] = p[q]);
        var s = "object" === typeof process && "function" === typeof require, ba = "object" === typeof window, ca = "function" === typeof importScripts, da = !ba && !s && !ca;
        if (s) {
            p.print || (p.print = function(a) {
                process.stdout.write(a + "\n")
            });
            p.printErr || (p.printErr = function(a) {
                process.stderr.write(a + "\n")
            });
            var ea = require("fs"), fa = require("path");
            p.read = function(a, b) {
                var a = fa.normalize(a), c = ea.readFileSync(a);
                !c && a != fa.resolve(a) && (a = path.join(__dirname, "..", "src", a), c = ea.readFileSync(a));
                c && !b && (c = c.toString());
                return c
            };
            p.readBinary = function(a) {
                return p.read(a, j)
            };
            p.load = function(a) {
                ga(read(a))
            };
            p.thisProgram = process.argv[1];
            p.arguments = process.argv.slice(2);
            module.exports = 
            p
        } else
            da ? (p.print || (p.print = print), "undefined" != typeof printErr && (p.printErr = printErr), p.read = "undefined" != typeof read ? read : function() {
                f("no read() available (jsc?)")
            }, p.readBinary = function(a) {
                return read(a, "binary")
            }, "undefined" != typeof scriptArgs ? p.arguments = scriptArgs : "undefined" != typeof arguments && (p.arguments = arguments), this.Module = p, eval("if (typeof gc === 'function' && gc.toString().indexOf('[native code]') > 0) var gc = undefined")) : ba || ca ? (p.read = function(a) {
                var b = new XMLHttpRequest;
                b.open("GET", 
                a, l);
                b.send(k);
                return b.responseText
            }, "undefined" != typeof arguments && (p.arguments = arguments), "undefined" !== typeof console ? (p.print || (p.print = function(a) {
                console.log(a)
            }), p.printErr || (p.printErr = function(a) {
                console.log(a)
            })) : p.print || (p.print = m()), ba ? window.Module = p : p.load = importScripts) : f("Unknown runtime environment. Where are we?");
        function ga(a) {
            eval.call(k, a)
        }
        "undefined" == !p.load && p.read && (p.load = function(a) {
            ga(p.read(a))
        });
        p.print || (p.print = m());
        p.printErr || (p.printErr = p.print);
        p.arguments || (p.arguments = []);
        p.print = p.print;
        p.U = p.printErr;
        p.preRun = [];
        p.postRun = [];
        for (q in aa)
            aa.hasOwnProperty(q) && (p[q] = aa[q]);
        var w = {vc: function(a) {
                ha = a
            },cc: function() {
                return ha
            },Ua: function() {
                return u
            },Ab: function(a) {
                u = a
            },Fe: function(a, b) {
                b = b || 4;
                return 1 == b ? a : isNumber(a) && isNumber(b) ? Math.ceil(a / b) * b : isNumber(b) && isPowerOfTwo(b) ? "(((" + a + ")+" + (b - 1) + ")&" + -b + ")" : "Math.ceil((" + a + ")/" + b + ")*" + b
            },ic: function(a) {
                return a in w.Nb || a in w.Mb
            },jc: function(a) {
                return "*" == a[a.length - 1]
            },kc: function(a) {
                return isPointerType(a) ? l : isArrayType(a) || /<?\{ ?[^}]* ?\}>?/.test(a) ? j : "%" == a[0]
            },Nb: {i1: 0,i8: 0,i16: 0,i32: 0,i64: 0},Mb: {"float": 0,"double": 0},
            Ye: function(a, b) {
                return (a | 0 | b | 0) + 4294967296 * (Math.round(a / 4294967296) | Math.round(b / 4294967296))
            },xe: function(a, b) {
                return ((a | 0) & (b | 0)) + 4294967296 * (Math.round(a / 4294967296) & Math.round(b / 4294967296))
            },cf: function(a, b) {
                return ((a | 0) ^ (b | 0)) + 4294967296 * (Math.round(a / 4294967296) ^ Math.round(b / 4294967296))
            },Ma: function(a) {
                switch (a) {
                    case "i1":
                    case "i8":
                        return 1;
                    case "i16":
                        return 2;
                    case "i32":
                        return 4;
                    case "i64":
                        return 8;
                    case "float":
                        return 4;
                    case "double":
                        return 8;
                    default:
                        return "*" === a[a.length - 1] ? w.R : "i" === 
                        a[0] ? (a = parseInt(a.substr(1)), x(0 === a % 8), a / 8) : 0
                }
            },bc: function(a) {
                return Math.max(w.Ma(a), w.R)
            },Xb: function(a, b) {
                var c = {};
                return b ? a.filter(function(a) {
                    return c[a[b]] ? l : c[a[b]] = j
                }) : a.filter(function(a) {
                    return c[a] ? l : c[a] = j
                })
            },set: function() {
                for (var a = "object" === typeof arguments[0] ? arguments[0] : arguments, b = {}, c = 0; c < a.length; c++)
                    b[a[c]] = 0;
                return b
            },oe: 8,La: function(a, b, c) {
                return !c && ("i64" == a || "double" == a) ? 8 : !a ? Math.min(b, 8) : Math.min(b || (a ? w.bc(a) : 0), w.R)
            },Tb: function(a) {
                a.H = 0;
                a.W = 0;
                var b = [], c = -1, d = 0;
                a.mb = a.Ia.map(function(e) {
                    d++;
                    var g, h;
                    w.ic(e) || w.jc(e) ? (g = w.Ma(e), h = w.La(e, g)) : w.kc(e) ? "0" === e[1] ? (g = 0, h = Types.types[e] ? w.La(k, Types.types[e].W) : a.W || QUANTUM_SIZE) : (g = Types.types[e].H, h = w.La(k, Types.types[e].W)) : "b" == e[0] ? (g = e.substr(1) | 0, h = 1) : "<" === e[0] ? g = h = Types.types[e].H : "i" === e[0] ? (g = h = parseInt(e.substr(1)) / 8, x(0 === g % 1, "cannot handle non-byte-size field " + e)) : x(l, "invalid type for calculateStructAlignment");
                    a.Ze && (h = 1);
                    a.W = Math.max(a.W, h);
                    e = w.V(a.H, h);
                    a.H = e + g;
                    0 <= c && b.push(e - c);
                    return c = e
                });
                a.ub && 
                "[" === a.ub[0] && (a.H = parseInt(a.ub.substr(1)) * a.H / 2);
                a.H = w.V(a.H, a.W);
                0 == b.length ? a.lb = a.H : 1 == w.Xb(b).length && (a.lb = b[0]);
                a.Ue = 1 != a.lb;
                return a.mb
            },$b: function(a, b, c) {
                var d, e;
                if (b) {
                    c = c || 0;
                    d = ("undefined" === typeof Types ? w.bf : Types.types)[b];
                    if (!d)
                        return k;
                    if (d.Ia.length != a.length)
                        return printErr("Number of named fields must match the type for " + b + ": possibly duplicate struct names. Cannot return structInfo"), k;
                    e = d.mb
                } else
                    d = {Ia: a.map(function(a) {
                            return a[0]
                        })}, e = w.Tb(d);
                var g = {qe: d.H};
                b ? a.forEach(function(a, 
                b) {
                    if ("string" === typeof a)
                        g[a] = e[b] + c;
                    else {
                        var r, v;
                        for (v in a)
                            r = v;
                        g[r] = w.$b(a[r], d.Ia[b], e[b])
                    }
                }) : a.forEach(function(a, b) {
                    g[a[1]] = e[b]
                });
                return g
            },Ha: function(a, b, c) {
                return c && c.length ? (c.splice || (c = Array.prototype.slice.call(c)), c.splice(0, 0, b), p["dynCall_" + a].apply(k, c)) : p["dynCall_" + a].call(k, b)
            },sa: [],Qb: function(a) {
                for (var b = 0; b < w.sa.length; b++)
                    if (!w.sa[b])
                        return w.sa[b] = a, 2 * (1 + b);
                f("Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS.")
            },qc: function(a) {
                w.sa[(a - 
                2) / 2] = k
            },Ge: function(a, b) {
                w.Ga || (w.Ga = {});
                var c = w.Ga[a];
                if (c)
                    return c;
                for (var c = [], d = 0; d < b; d++)
                    c.push(String.fromCharCode(36) + d);
                d = A(a);
                '"' === d[0] && (d.indexOf('"', 1) === d.length - 1 ? d = d.substr(1, d.length - 2) : B("invalid EM_ASM input |" + d + "|. Please use EM_ASM(..code..) (no quotes) or EM_ASM({ ..code($0).. }, input) (to input values)"));
                try {
                    var e = eval("(function(" + c.join(",") + "){ " + d + " })")
                } catch (g) {
                    p.U("error in executing inline EM_ASM code: " + g + " on: \n\n" + d + "\n\nwith args |" + c + "| (make sure to use the right one out of EM_ASM, EM_ASM_ARGS, etc.)"), 
                    f(g)
                }
                return w.Ga[a] = e
            },ja: function(a) {
                w.ja.Ta || (w.ja.Ta = {});
                w.ja.Ta[a] || (w.ja.Ta[a] = 1, p.U(a))
            },Ka: {},Je: function(a, b) {
                x(b);
                w.Ka[a] || (w.Ka[a] = function() {
                    return w.Ha(b, a, arguments)
                });
                return w.Ka[a]
            },Ea: function() {
                var a = [], b = 0;
                this.Pa = function(c) {
                    c &= 255;
                    if (0 == a.length) {
                        if (0 == (c & 128))
                            return String.fromCharCode(c);
                        a.push(c);
                        b = 192 == (c & 224) ? 1 : 224 == (c & 240) ? 2 : 3;
                        return ""
                    }
                    if (b && (a.push(c), b--, 0 < b))
                        return "";
                    var c = a[0], d = a[1], e = a[2], g = a[3];
                    2 == a.length ? c = String.fromCharCode((c & 31) << 6 | d & 63) : 3 == a.length ? c = String.fromCharCode((c & 
                    15) << 12 | (d & 63) << 6 | e & 63) : (c = (c & 7) << 18 | (d & 63) << 12 | (e & 63) << 6 | g & 63, c = String.fromCharCode(Math.floor((c - 65536) / 1024) + 55296, (c - 65536) % 1024 + 56320));
                    a.length = 0;
                    return c
                };
                this.oc = function(a) {
                    for (var a = unescape(encodeURIComponent(a)), b = [], e = 0; e < a.length; e++)
                        b.push(a.charCodeAt(e));
                    return b
                }
            },He: function() {
                f("You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work")
            },Aa: function(a) {
                var b = u;
                u = u + a | 0;
                u = u + 7 & -8;
                return b
            },Bb: function(a) {
                var b = D;
                D = 
                D + a | 0;
                D = D + 7 & -8;
                return b
            },ra: function(a) {
                var b = G;
                G = G + a | 0;
                G = G + 7 & -8;
                G >= H && B("Cannot enlarge memory arrays. Either (1) compile with -s TOTAL_MEMORY=X with X higher than the current value " + H + ", (2) compile with ALLOW_MEMORY_GROWTH which adjusts the size at runtime but prevents some optimizations, or (3) set Module.TOTAL_MEMORY before the program runs.");
                return b
            },V: function(a, b) {
                return Math.ceil(a / (b ? b : 8)) * (b ? b : 8)
            },Se: function(a, b, c) {
                return c ? +(a >>> 0) + 4294967296 * +(b >>> 0) : +(a >>> 0) + 4294967296 * +(b | 0)
            },ab: 8,
            R: 4,pe: 0};
        p.Runtime = w;
        w.addFunction = w.Qb;
        w.removeFunction = w.qc;
        var ia = l, ja, ka, ha;
        function x(a, b) {
            a || B("Assertion failed: " + b)
        }
        function la(a) {
            var b = p["_" + a];
            if (!b)
                try {
                    b = eval("_" + a)
                } catch (c) {
                }
            x(b, "Cannot call unknown function " + a + " (perhaps LLVM optimizations or closure removed it?)");
            return b
        }
        var ma, na;
        (function() {
            function a(a) {
                a = a.toString().match(e).slice(1);
                return {arguments: a[0],body: a[1],returnValue: a[2]}
            }
            var b = 0, c = {stackSave: function() {
                    b = w.Ua()
                },stackRestore: function() {
                    w.Ab(b)
                },arrayToC: function(a) {
                    var b = w.Aa(a.length);
                    oa(a, b);
                    return b
                },stringToC: function(a) {
                    var b = 0;
                    a !== k && (a !== i && 0 !== a) && (b = w.Aa(a.length + 1), pa(a, b));
                    return b
                }}, d = {string: c.stringToC,array: c.arrayToC};
            na = function(a, e, g, h) {
                var a = la(a), z = [];
                if (h)
                    for (var n = 0; n < h.length; n++) {
                        var t = d[g[n]];
                        t ? (0 === b && (b = w.Ua()), z[n] = t(h[n])) : z[n] = 
                        h[n]
                    }
                g = a.apply(k, z);
                "string" === e && (g = A(g));
                0 !== b && c.stackRestore();
                return g
            };
            var e = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/, g = {}, h;
            for (h in c)
                c.hasOwnProperty(h) && (g[h] = a(c[h]));
            ma = function(b, c, d) {
                var e = la(b), b = d.every(function(a) {
                    return "number" === a
                }), h = "string" !== c;
                if (h && b)
                    return e;
                var n = d.map(function(a, b) {
                    return "$" + b
                }), c = "(function(" + n.join(",") + ") {", t = d.length;
                if (!b)
                    for (var c = c + (g.stackSave.body + ";"), E = 0; E < t; E++) {
                        var W = n[E], F = d[E];
                        "number" !== F && (F = g[F + "ToC"], 
                        c += "var " + F.arguments + " = " + W + ";", c += F.body + ";", c += W + "=" + F.returnValue + ";")
                    }
                d = a(function() {
                    return e
                }).returnValue;
                c += "var ret = " + d + "(" + n.join(",") + ");";
                h || (d = a(function() {
                    return A
                }).returnValue, c += "ret = " + d + "(ret);");
                b || (c += g.stackRestore.body + ";");
                return eval(c + "return ret})")
            }
        })();
        p.cwrap = ma;
        p.ccall = na;
        function qa(a, b, c) {
            c = c || "i8";
            "*" === c.charAt(c.length - 1) && (c = "i32");
            switch (c) {
                case "i1":
                    I[a >> 0] = b;
                    break;
                case "i8":
                    I[a >> 0] = b;
                    break;
                case "i16":
                    ra[a >> 1] = b;
                    break;
                case "i32":
                    J[a >> 2] = b;
                    break;
                case "i64":
                    ka = [b >>> 0, (ja = b, 1 <= +sa(ja) ? 0 < ja ? (ta(+ua(ja / 4294967296), 4294967295) | 0) >>> 0 : ~~+va((ja - +(~~ja >>> 0)) / 4294967296) >>> 0 : 0)];
                    J[a >> 2] = ka[0];
                    J[a + 4 >> 2] = ka[1];
                    break;
                case "float":
                    wa[a >> 2] = b;
                    break;
                case "double":
                    xa[a >> 3] = b;
                    break;
                default:
                    B("invalid type for setValue: " + c)
            }
        }
        p.setValue = qa;
        p.getValue = function(a, b) {
            b = b || "i8";
            "*" === b.charAt(b.length - 1) && (b = "i32");
            switch (b) {
                case "i1":
                    return I[a >> 0];
                case "i8":
                    return I[a >> 0];
                case "i16":
                    return ra[a >> 1];
                case "i32":
                    return J[a >> 2];
                case "i64":
                    return J[a >> 2];
                case "float":
                    return wa[a >> 2];
                case "double":
                    return xa[a >> 3];
                default:
                    B("invalid type for setValue: " + b)
            }
            return k
        };
        var ya = 2, za = 4;
        p.ALLOC_NORMAL = 0;
        p.ALLOC_STACK = 1;
        p.ALLOC_STATIC = ya;
        p.ALLOC_DYNAMIC = 3;
        p.ALLOC_NONE = za;
        function K(a, b, c, d) {
            var e, g;
            "number" === typeof a ? (e = j, g = a) : (e = l, g = a.length);
            var h = "string" === typeof b ? b : k, c = c == za ? d : [Aa, w.Aa, w.Bb, w.ra][c === i ? ya : c](Math.max(g, h ? 1 : b.length));
            if (e) {
                d = c;
                x(0 == (c & 3));
                for (a = c + (g & -4); d < a; d += 4)
                    J[d >> 2] = 0;
                for (a = c + g; d < a; )
                    I[d++ >> 0] = 0;
                return c
            }
            if ("i8" === h)
                return a.subarray || a.slice ? L.set(a, c) : L.set(new Uint8Array(a), c), c;
            for (var d = 0, C, r; d < g; ) {
                var v = a[d];
                "function" === typeof v && (v = w.Ke(v));
                e = h || b[d];
                0 === e ? d++ : ("i64" == e && (e = "i32"), qa(c + d, v, e), r !== e && (C = w.Ma(e), r = e), d += C)
            }
            return c
        }
        p.allocate = K;
        function A(a, b) {
            for (var c = l, d, e = 0; ; ) {
                d = L[a + e >> 0];
                if (128 <= d)
                    c = j;
                else if (0 == d && !b)
                    break;
                e++;
                if (b && e == b)
                    break
            }
            b || (b = e);
            var g = "";
            if (!c) {
                for (; 0 < b; )
                    d = String.fromCharCode.apply(String, L.subarray(a, a + Math.min(b, 1024))), g = g ? g + d : d, a += 1024, b -= 1024;
                return g
            }
            c = new w.Ea;
            for (e = 0; e < b; e++)
                d = L[a + e >> 0], g += c.Pa(d);
            return g
        }
        p.Pointer_stringify = A;
        p.UTF16ToString = function(a) {
            for (var b = 0, c = ""; ; ) {
                var d = ra[a + 2 * b >> 1];
                if (0 == d)
                    return c;
                ++b;
                c += String.fromCharCode(d)
            }
        };
        p.stringToUTF16 = function(a, b) {
            for (var c = 0; c < a.length; ++c)
                ra[b + 2 * c >> 1] = a.charCodeAt(c);
            ra[b + 2 * a.length >> 1] = 0
        };
        p.UTF32ToString = function(a) {
            for (var b = 0, c = ""; ; ) {
                var d = J[a + 4 * b >> 2];
                if (0 == d)
                    return c;
                ++b;
                65536 <= d ? (d -= 65536, c += String.fromCharCode(55296 | d >> 10, 56320 | d & 1023)) : c += String.fromCharCode(d)
            }
        };
        p.stringToUTF32 = function(a, b) {
            for (var c = 0, d = 0; d < a.length; ++d) {
                var e = a.charCodeAt(d);
                if (55296 <= e && 57343 >= e)
                    var g = a.charCodeAt(++d), e = 65536 + ((e & 1023) << 10) | g & 1023;
                J[b + 4 * c >> 2] = e;
                ++c
            }
            J[b + 4 * c >> 2] = 0
        };
        function Ba(a) {
            function b(h, r, v) {
                var r = r || Infinity, y = "", z = [], n;
                if ("N" === a[c]) {
                    c++;
                    "K" === a[c] && c++;
                    for (n = []; "E" !== a[c]; )
                        if ("S" === a[c]) {
                            c++;
                            var t = a.indexOf("_", c);
                            n.push(e[a.substring(c, t) || 0] || "?");
                            c = t + 1
                        } else if ("C" === a[c])
                            n.push(n[n.length - 1]), c += 2;
                        else {
                            var t = parseInt(a.substr(c)), E = t.toString().length;
                            if (!t || !E) {
                                c--;
                                break
                            }
                            var W = a.substr(c + E, t);
                            n.push(W);
                            e.push(W);
                            c += E + t
                        }
                    c++;
                    n = n.join("::");
                    r--;
                    if (0 === r)
                        return h ? [n] : n
                } else if (("K" === a[c] || g && "L" === a[c]) && c++, t = parseInt(a.substr(c)))
                    E = t.toString().length, 
                    n = a.substr(c + E, t), c += E + t;
                g = l;
                "I" === a[c] ? (c++, t = b(j), E = b(j, 1, j), y += E[0] + " " + n + "<" + t.join(", ") + ">") : y = n;
                a: for (; c < a.length && 0 < r--; )
                    if (n = a[c++], n in d)
                        z.push(d[n]);
                    else
                        switch (n) {
                            case "P":
                                z.push(b(j, 1, j)[0] + "*");
                                break;
                            case "R":
                                z.push(b(j, 1, j)[0] + "&");
                                break;
                            case "L":
                                c++;
                                t = a.indexOf("E", c) - c;
                                z.push(a.substr(c, t));
                                c += t + 2;
                                break;
                            case "A":
                                t = parseInt(a.substr(c));
                                c += t.toString().length;
                                "_" !== a[c] && f("?");
                                c++;
                                z.push(b(j, 1, j)[0] + " [" + t + "]");
                                break;
                            case "E":
                                break a;
                            default:
                                y += "?" + n;
                                break a
                        }
                !v && (1 === z.length && "void" === 
                z[0]) && (z = []);
                return h ? (y && z.push(y + "?"), z) : y + ("(" + z.join(", ") + ")")
            }
            var c = 3, d = {v: "void",b: "bool",c: "char",s: "short",i: "int",l: "long",f: "float",d: "double",w: "wchar_t",a: "signed char",h: "unsigned char",t: "unsigned short",j: "unsigned int",m: "unsigned long",x: "long long",y: "unsigned long long",z: "..."}, e = [], g = j;
            try {
                if ("Object._main" == a || "_main" == a)
                    return "main()";
                "number" === typeof a && (a = A(a));
                if ("_" !== a[0] || "_" !== a[1] || "Z" !== a[2])
                    return a;
                switch (a[3]) {
                    case "n":
                        return "operator new()";
                    case "d":
                        return "operator delete()"
                }
                return b()
            } catch (h) {
                return a
            }
        }
        function Ca() {
            var a = Error().stack;
            return a ? a.replace(/__Z[\w\d_]+/g, function(a) {
                var c = Ba(a);
                return a === c ? a : a + " [" + c + "]"
            }) : "(no stack trace available)"
        }
        for (var I, L, ra, Da, J, Ea, wa, xa, Fa = 0, D = 0, Ga = 0, u = 0, Ha = 0, Ia = 0, G = 0, Ja = p.TOTAL_STACK || 5242880, H = p.TOTAL_MEMORY || 16777216, M = 4096; M < H || M < 2 * Ja; )
            M = 16777216 > M ? 2 * M : M + 16777216;
        M !== H && (p.U("increasing TOTAL_MEMORY to " + M + " to be more reasonable"), H = M);
        x("undefined" !== typeof Int32Array && "undefined" !== typeof Float64Array && !!(new Int32Array(1)).subarray && !!(new Int32Array(1)).set, "JS engine does not provide full typed array support");
        var N = new ArrayBuffer(H);
        I = new Int8Array(N);
        ra = new Int16Array(N);
        J = new Int32Array(N);
        L = new Uint8Array(N);
        Da = new Uint16Array(N);
        Ea = new Uint32Array(N);
        wa = new Float32Array(N);
        xa = new Float64Array(N);
        J[0] = 255;
        x(255 === L[0] && 0 === L[3], "Typed arrays 2 must be run on a little-endian system");
        p.HEAP = i;
        p.HEAP8 = I;
        p.HEAP16 = ra;
        p.HEAP32 = J;
        p.HEAPU8 = L;
        p.HEAPU16 = Da;
        p.HEAPU32 = Ea;
        p.HEAPF32 = wa;
        p.HEAPF64 = xa;
        function Ka(a) {
            for (; 0 < a.length; ) {
                var b = a.shift();
                if ("function" == typeof b)
                    b();
                else {
                    var c = b.X;
                    "number" === typeof c ? b.Fa === i ? w.Ha("v", c) : w.Ha("vi", c, [b.Fa]) : c(b.Fa === i ? k : b.Fa)
                }
            }
        }
        var La = [], Ma = [], Na = [], Oa = [], Pa = [], Qa = l;
        function Ra(a) {
            La.unshift(a)
        }
        p.addOnPreRun = p.ve = Ra;
        p.addOnInit = p.se = function(a) {
            Ma.unshift(a)
        };
        p.addOnPreMain = p.ue = function(a) {
            Na.unshift(a)
        };
        p.addOnExit = p.re = function(a) {
            Oa.unshift(a)
        };
        function Sa(a) {
            Pa.unshift(a)
        }
        p.addOnPostRun = p.te = Sa;
        function Ta(a, b, c) {
            a = (new w.Ea).oc(a);
            c && (a.length = c);
            b || a.push(0);
            return a
        }
        p.intArrayFromString = Ta;
        p.intArrayToString = function(a) {
            for (var b = [], c = 0; c < a.length; c++) {
                var d = a[c];
                255 < d && (d &= 255);
                b.push(String.fromCharCode(d))
            }
            return b.join("")
        };
        function pa(a, b, c) {
            a = Ta(a, c);
            for (c = 0; c < a.length; )
                I[b + c >> 0] = a[c], c += 1
        }
        p.writeStringToMemory = pa;
        function oa(a, b) {
            for (var c = 0; c < a.length; c++)
                I[b + c >> 0] = a[c]
        }
        p.writeArrayToMemory = oa;
        p.writeAsciiToMemory = function(a, b, c) {
            for (var d = 0; d < a.length; d++)
                I[b + d >> 0] = a.charCodeAt(d);
            c || (I[b + a.length >> 0] = 0)
        };
        if (!Math.imul || -5 !== Math.imul(4294967295, 5))
            Math.imul = function(a, b) {
                var c = a & 65535, d = b & 65535;
                return c * d + ((a >>> 16) * d + c * (b >>> 16) << 16) | 0
            };
        Math.Ne = Math.imul;
        var sa = Math.abs, va = Math.ceil, ua = Math.floor, ta = Math.min, O = 0, Ua = k, Va = k;
        function Wa() {
            O++;
            p.monitorRunDependencies && p.monitorRunDependencies(O)
        }
        p.addRunDependency = Wa;
        function Xa() {
            O--;
            p.monitorRunDependencies && p.monitorRunDependencies(O);
            if (0 == O && (Ua !== k && (clearInterval(Ua), Ua = k), Va)) {
                var a = Va;
                Va = k;
                a()
            }
        }
        p.removeRunDependency = Xa;
        p.preloadedImages = {};
        p.preloadedAudios = {};
        Fa = 8;
        D = Fa + w.V(14707);
        Ma.push();
        K([49, 46, 50, 46, 53, 0, 0, 0, 114, 101, 116, 32, 33, 61, 32, 90, 95, 83, 84, 82, 69, 65, 77, 95, 69, 82, 82, 79, 82, 0, 0, 0, 115, 114, 99, 47, 122, 112, 105, 112, 101, 46, 99, 0, 0, 0, 0, 0, 100, 101, 102, 0, 0, 0, 0, 0, 115, 116, 114, 109, 46, 97, 118, 97, 105, 108, 95, 105, 110, 32, 61, 61, 32, 48, 0, 0, 0, 0, 0, 0, 114, 101, 116, 32, 61, 61, 32, 90, 95, 83, 84, 82, 69, 65, 77, 95, 69, 78, 68, 0, 0, 0, 0, 0, 105, 110, 102, 0, 0, 0, 0, 0, 105, 110, 112, 117, 116, 0, 0, 0, 114, 0, 0, 0, 0, 0, 0, 0, 111, 117, 116, 112, 117, 116, 0, 0, 119, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 4, 0, 4, 0, 8, 0, 4, 0, 2, 0, 0, 0, 4, 0, 5, 0, 16, 0, 8, 0, 2, 0, 0, 0, 4, 0, 
            6, 0, 32, 0, 32, 0, 2, 0, 0, 0, 4, 0, 4, 0, 16, 0, 16, 0, 3, 0, 0, 0, 8, 0, 16, 0, 32, 0, 32, 0, 3, 0, 0, 0, 8, 0, 16, 0, 128, 0, 128, 0, 3, 0, 0, 0, 8, 0, 32, 0, 128, 0, 0, 1, 3, 0, 0, 0, 32, 0, 128, 0, 2, 1, 0, 4, 3, 0, 0, 0, 32, 0, 2, 1, 2, 1, 0, 16, 3, 0, 0, 0, 16, 0, 17, 0, 18, 0, 0, 0, 8, 0, 7, 0, 9, 0, 6, 0, 10, 0, 5, 0, 11, 0, 4, 0, 12, 0, 3, 0, 13, 0, 2, 0, 14, 0, 1, 0, 15, 0, 0, 0, 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 104, 101, 97, 100, 101, 114, 32, 99, 104, 101, 99, 107, 0, 0, 117, 110, 107, 110, 111, 119, 110, 32, 99, 111, 109, 112, 114, 101, 115, 115, 105, 111, 110, 32, 109, 101, 116, 104, 111, 100, 0, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 
            119, 105, 110, 100, 111, 119, 32, 115, 105, 122, 101, 0, 0, 0, 0, 0, 117, 110, 107, 110, 111, 119, 110, 32, 104, 101, 97, 100, 101, 114, 32, 102, 108, 97, 103, 115, 32, 115, 101, 116, 0, 0, 0, 0, 0, 0, 0, 0, 104, 101, 97, 100, 101, 114, 32, 99, 114, 99, 32, 109, 105, 115, 109, 97, 116, 99, 104, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 98, 108, 111, 99, 107, 32, 116, 121, 112, 101, 0, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 115, 116, 111, 114, 101, 100, 32, 98, 108, 111, 99, 107, 32, 108, 101, 110, 103, 116, 104, 115, 0, 0, 0, 0, 116, 111, 111, 32, 109, 97, 110, 121, 32, 108, 101, 110, 103, 116, 104, 32, 111, 114, 32, 
            100, 105, 115, 116, 97, 110, 99, 101, 32, 115, 121, 109, 98, 111, 108, 115, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 99, 111, 100, 101, 32, 108, 101, 110, 103, 116, 104, 115, 32, 115, 101, 116, 0, 0, 0, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 98, 105, 116, 32, 108, 101, 110, 103, 116, 104, 32, 114, 101, 112, 101, 97, 116, 0, 0, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 99, 111, 100, 101, 32, 45, 45, 32, 109, 105, 115, 115, 105, 110, 103, 32, 101, 110, 100, 45, 111, 102, 45, 98, 108, 111, 99, 107, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 108, 105, 116, 101, 114, 97, 108, 47, 108, 101, 110, 103, 
            116, 104, 115, 32, 115, 101, 116, 0, 0, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 115, 32, 115, 101, 116, 0, 0, 0, 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 100, 97, 116, 97, 32, 99, 104, 101, 99, 107, 0, 0, 0, 0, 105, 110, 99, 111, 114, 114, 101, 99, 116, 32, 108, 101, 110, 103, 116, 104, 32, 99, 104, 101, 99, 107, 0, 0, 96, 7, 0, 0, 0, 8, 80, 0, 0, 8, 16, 0, 20, 8, 115, 0, 18, 7, 31, 0, 0, 8, 112, 0, 0, 8, 48, 0, 0, 9, 192, 0, 16, 7, 10, 0, 0, 8, 96, 0, 0, 8, 32, 0, 0, 9, 160, 0, 0, 8, 0, 0, 0, 8, 128, 0, 0, 8, 64, 0, 0, 9, 224, 0, 16, 7, 6, 0, 0, 8, 88, 0, 0, 8, 24, 0, 0, 9, 144, 0, 19, 7, 59, 0, 0, 8, 120, 0, 0, 8, 
            56, 0, 0, 9, 208, 0, 17, 7, 17, 0, 0, 8, 104, 0, 0, 8, 40, 0, 0, 9, 176, 0, 0, 8, 8, 0, 0, 8, 136, 0, 0, 8, 72, 0, 0, 9, 240, 0, 16, 7, 4, 0, 0, 8, 84, 0, 0, 8, 20, 0, 21, 8, 227, 0, 19, 7, 43, 0, 0, 8, 116, 0, 0, 8, 52, 0, 0, 9, 200, 0, 17, 7, 13, 0, 0, 8, 100, 0, 0, 8, 36, 0, 0, 9, 168, 0, 0, 8, 4, 0, 0, 8, 132, 0, 0, 8, 68, 0, 0, 9, 232, 0, 16, 7, 8, 0, 0, 8, 92, 0, 0, 8, 28, 0, 0, 9, 152, 0, 20, 7, 83, 0, 0, 8, 124, 0, 0, 8, 60, 0, 0, 9, 216, 0, 18, 7, 23, 0, 0, 8, 108, 0, 0, 8, 44, 0, 0, 9, 184, 0, 0, 8, 12, 0, 0, 8, 140, 0, 0, 8, 76, 0, 0, 9, 248, 0, 16, 7, 3, 0, 0, 8, 82, 0, 0, 8, 18, 0, 21, 8, 163, 0, 19, 7, 35, 0, 0, 8, 114, 0, 0, 8, 50, 0, 0, 9, 196, 0, 17, 7, 11, 0, 0, 8, 98, 0, 0, 8, 34, 0, 
            0, 9, 164, 0, 0, 8, 2, 0, 0, 8, 130, 0, 0, 8, 66, 0, 0, 9, 228, 0, 16, 7, 7, 0, 0, 8, 90, 0, 0, 8, 26, 0, 0, 9, 148, 0, 20, 7, 67, 0, 0, 8, 122, 0, 0, 8, 58, 0, 0, 9, 212, 0, 18, 7, 19, 0, 0, 8, 106, 0, 0, 8, 42, 0, 0, 9, 180, 0, 0, 8, 10, 0, 0, 8, 138, 0, 0, 8, 74, 0, 0, 9, 244, 0, 16, 7, 5, 0, 0, 8, 86, 0, 0, 8, 22, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 118, 0, 0, 8, 54, 0, 0, 9, 204, 0, 17, 7, 15, 0, 0, 8, 102, 0, 0, 8, 38, 0, 0, 9, 172, 0, 0, 8, 6, 0, 0, 8, 134, 0, 0, 8, 70, 0, 0, 9, 236, 0, 16, 7, 9, 0, 0, 8, 94, 0, 0, 8, 30, 0, 0, 9, 156, 0, 20, 7, 99, 0, 0, 8, 126, 0, 0, 8, 62, 0, 0, 9, 220, 0, 18, 7, 27, 0, 0, 8, 110, 0, 0, 8, 46, 0, 0, 9, 188, 0, 0, 8, 14, 0, 0, 8, 142, 0, 0, 8, 78, 0, 0, 9, 252, 
            0, 96, 7, 0, 0, 0, 8, 81, 0, 0, 8, 17, 0, 21, 8, 131, 0, 18, 7, 31, 0, 0, 8, 113, 0, 0, 8, 49, 0, 0, 9, 194, 0, 16, 7, 10, 0, 0, 8, 97, 0, 0, 8, 33, 0, 0, 9, 162, 0, 0, 8, 1, 0, 0, 8, 129, 0, 0, 8, 65, 0, 0, 9, 226, 0, 16, 7, 6, 0, 0, 8, 89, 0, 0, 8, 25, 0, 0, 9, 146, 0, 19, 7, 59, 0, 0, 8, 121, 0, 0, 8, 57, 0, 0, 9, 210, 0, 17, 7, 17, 0, 0, 8, 105, 0, 0, 8, 41, 0, 0, 9, 178, 0, 0, 8, 9, 0, 0, 8, 137, 0, 0, 8, 73, 0, 0, 9, 242, 0, 16, 7, 4, 0, 0, 8, 85, 0, 0, 8, 21, 0, 16, 8, 2, 1, 19, 7, 43, 0, 0, 8, 117, 0, 0, 8, 53, 0, 0, 9, 202, 0, 17, 7, 13, 0, 0, 8, 101, 0, 0, 8, 37, 0, 0, 9, 170, 0, 0, 8, 5, 0, 0, 8, 133, 0, 0, 8, 69, 0, 0, 9, 234, 0, 16, 7, 8, 0, 0, 8, 93, 0, 0, 8, 29, 0, 0, 9, 154, 0, 20, 7, 83, 
            0, 0, 8, 125, 0, 0, 8, 61, 0, 0, 9, 218, 0, 18, 7, 23, 0, 0, 8, 109, 0, 0, 8, 45, 0, 0, 9, 186, 0, 0, 8, 13, 0, 0, 8, 141, 0, 0, 8, 77, 0, 0, 9, 250, 0, 16, 7, 3, 0, 0, 8, 83, 0, 0, 8, 19, 0, 21, 8, 195, 0, 19, 7, 35, 0, 0, 8, 115, 0, 0, 8, 51, 0, 0, 9, 198, 0, 17, 7, 11, 0, 0, 8, 99, 0, 0, 8, 35, 0, 0, 9, 166, 0, 0, 8, 3, 0, 0, 8, 131, 0, 0, 8, 67, 0, 0, 9, 230, 0, 16, 7, 7, 0, 0, 8, 91, 0, 0, 8, 27, 0, 0, 9, 150, 0, 20, 7, 67, 0, 0, 8, 123, 0, 0, 8, 59, 0, 0, 9, 214, 0, 18, 7, 19, 0, 0, 8, 107, 0, 0, 8, 43, 0, 0, 9, 182, 0, 0, 8, 11, 0, 0, 8, 139, 0, 0, 8, 75, 0, 0, 9, 246, 0, 16, 7, 5, 0, 0, 8, 87, 0, 0, 8, 23, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 119, 0, 0, 8, 55, 0, 0, 9, 206, 0, 17, 7, 15, 0, 0, 8, 
            103, 0, 0, 8, 39, 0, 0, 9, 174, 0, 0, 8, 7, 0, 0, 8, 135, 0, 0, 8, 71, 0, 0, 9, 238, 0, 16, 7, 9, 0, 0, 8, 95, 0, 0, 8, 31, 0, 0, 9, 158, 0, 20, 7, 99, 0, 0, 8, 127, 0, 0, 8, 63, 0, 0, 9, 222, 0, 18, 7, 27, 0, 0, 8, 111, 0, 0, 8, 47, 0, 0, 9, 190, 0, 0, 8, 15, 0, 0, 8, 143, 0, 0, 8, 79, 0, 0, 9, 254, 0, 96, 7, 0, 0, 0, 8, 80, 0, 0, 8, 16, 0, 20, 8, 115, 0, 18, 7, 31, 0, 0, 8, 112, 0, 0, 8, 48, 0, 0, 9, 193, 0, 16, 7, 10, 0, 0, 8, 96, 0, 0, 8, 32, 0, 0, 9, 161, 0, 0, 8, 0, 0, 0, 8, 128, 0, 0, 8, 64, 0, 0, 9, 225, 0, 16, 7, 6, 0, 0, 8, 88, 0, 0, 8, 24, 0, 0, 9, 145, 0, 19, 7, 59, 0, 0, 8, 120, 0, 0, 8, 56, 0, 0, 9, 209, 0, 17, 7, 17, 0, 0, 8, 104, 0, 0, 8, 40, 0, 0, 9, 177, 0, 0, 8, 8, 0, 0, 8, 136, 0, 0, 
            8, 72, 0, 0, 9, 241, 0, 16, 7, 4, 0, 0, 8, 84, 0, 0, 8, 20, 0, 21, 8, 227, 0, 19, 7, 43, 0, 0, 8, 116, 0, 0, 8, 52, 0, 0, 9, 201, 0, 17, 7, 13, 0, 0, 8, 100, 0, 0, 8, 36, 0, 0, 9, 169, 0, 0, 8, 4, 0, 0, 8, 132, 0, 0, 8, 68, 0, 0, 9, 233, 0, 16, 7, 8, 0, 0, 8, 92, 0, 0, 8, 28, 0, 0, 9, 153, 0, 20, 7, 83, 0, 0, 8, 124, 0, 0, 8, 60, 0, 0, 9, 217, 0, 18, 7, 23, 0, 0, 8, 108, 0, 0, 8, 44, 0, 0, 9, 185, 0, 0, 8, 12, 0, 0, 8, 140, 0, 0, 8, 76, 0, 0, 9, 249, 0, 16, 7, 3, 0, 0, 8, 82, 0, 0, 8, 18, 0, 21, 8, 163, 0, 19, 7, 35, 0, 0, 8, 114, 0, 0, 8, 50, 0, 0, 9, 197, 0, 17, 7, 11, 0, 0, 8, 98, 0, 0, 8, 34, 0, 0, 9, 165, 0, 0, 8, 2, 0, 0, 8, 130, 0, 0, 8, 66, 0, 0, 9, 229, 0, 16, 7, 7, 0, 0, 8, 90, 0, 0, 8, 26, 0, 
            0, 9, 149, 0, 20, 7, 67, 0, 0, 8, 122, 0, 0, 8, 58, 0, 0, 9, 213, 0, 18, 7, 19, 0, 0, 8, 106, 0, 0, 8, 42, 0, 0, 9, 181, 0, 0, 8, 10, 0, 0, 8, 138, 0, 0, 8, 74, 0, 0, 9, 245, 0, 16, 7, 5, 0, 0, 8, 86, 0, 0, 8, 22, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 118, 0, 0, 8, 54, 0, 0, 9, 205, 0, 17, 7, 15, 0, 0, 8, 102, 0, 0, 8, 38, 0, 0, 9, 173, 0, 0, 8, 6, 0, 0, 8, 134, 0, 0, 8, 70, 0, 0, 9, 237, 0, 16, 7, 9, 0, 0, 8, 94, 0, 0, 8, 30, 0, 0, 9, 157, 0, 20, 7, 99, 0, 0, 8, 126, 0, 0, 8, 62, 0, 0, 9, 221, 0, 18, 7, 27, 0, 0, 8, 110, 0, 0, 8, 46, 0, 0, 9, 189, 0, 0, 8, 14, 0, 0, 8, 142, 0, 0, 8, 78, 0, 0, 9, 253, 0, 96, 7, 0, 0, 0, 8, 81, 0, 0, 8, 17, 0, 21, 8, 131, 0, 18, 7, 31, 0, 0, 8, 113, 0, 0, 8, 49, 0, 0, 9, 
            195, 0, 16, 7, 10, 0, 0, 8, 97, 0, 0, 8, 33, 0, 0, 9, 163, 0, 0, 8, 1, 0, 0, 8, 129, 0, 0, 8, 65, 0, 0, 9, 227, 0, 16, 7, 6, 0, 0, 8, 89, 0, 0, 8, 25, 0, 0, 9, 147, 0, 19, 7, 59, 0, 0, 8, 121, 0, 0, 8, 57, 0, 0, 9, 211, 0, 17, 7, 17, 0, 0, 8, 105, 0, 0, 8, 41, 0, 0, 9, 179, 0, 0, 8, 9, 0, 0, 8, 137, 0, 0, 8, 73, 0, 0, 9, 243, 0, 16, 7, 4, 0, 0, 8, 85, 0, 0, 8, 21, 0, 16, 8, 2, 1, 19, 7, 43, 0, 0, 8, 117, 0, 0, 8, 53, 0, 0, 9, 203, 0, 17, 7, 13, 0, 0, 8, 101, 0, 0, 8, 37, 0, 0, 9, 171, 0, 0, 8, 5, 0, 0, 8, 133, 0, 0, 8, 69, 0, 0, 9, 235, 0, 16, 7, 8, 0, 0, 8, 93, 0, 0, 8, 29, 0, 0, 9, 155, 0, 20, 7, 83, 0, 0, 8, 125, 0, 0, 8, 61, 0, 0, 9, 219, 0, 18, 7, 23, 0, 0, 8, 109, 0, 0, 8, 45, 0, 0, 9, 187, 0, 0, 
            8, 13, 0, 0, 8, 141, 0, 0, 8, 77, 0, 0, 9, 251, 0, 16, 7, 3, 0, 0, 8, 83, 0, 0, 8, 19, 0, 21, 8, 195, 0, 19, 7, 35, 0, 0, 8, 115, 0, 0, 8, 51, 0, 0, 9, 199, 0, 17, 7, 11, 0, 0, 8, 99, 0, 0, 8, 35, 0, 0, 9, 167, 0, 0, 8, 3, 0, 0, 8, 131, 0, 0, 8, 67, 0, 0, 9, 231, 0, 16, 7, 7, 0, 0, 8, 91, 0, 0, 8, 27, 0, 0, 9, 151, 0, 20, 7, 67, 0, 0, 8, 123, 0, 0, 8, 59, 0, 0, 9, 215, 0, 18, 7, 19, 0, 0, 8, 107, 0, 0, 8, 43, 0, 0, 9, 183, 0, 0, 8, 11, 0, 0, 8, 139, 0, 0, 8, 75, 0, 0, 9, 247, 0, 16, 7, 5, 0, 0, 8, 87, 0, 0, 8, 23, 0, 64, 8, 0, 0, 19, 7, 51, 0, 0, 8, 119, 0, 0, 8, 55, 0, 0, 9, 207, 0, 17, 7, 15, 0, 0, 8, 103, 0, 0, 8, 39, 0, 0, 9, 175, 0, 0, 8, 7, 0, 0, 8, 135, 0, 0, 8, 71, 0, 0, 9, 239, 0, 16, 7, 9, 0, 
            0, 8, 95, 0, 0, 8, 31, 0, 0, 9, 159, 0, 20, 7, 99, 0, 0, 8, 127, 0, 0, 8, 63, 0, 0, 9, 223, 0, 18, 7, 27, 0, 0, 8, 111, 0, 0, 8, 47, 0, 0, 9, 191, 0, 0, 8, 15, 0, 0, 8, 143, 0, 0, 8, 79, 0, 0, 9, 255, 0, 16, 5, 1, 0, 23, 5, 1, 1, 19, 5, 17, 0, 27, 5, 1, 16, 17, 5, 5, 0, 25, 5, 1, 4, 21, 5, 65, 0, 29, 5, 1, 64, 16, 5, 3, 0, 24, 5, 1, 2, 20, 5, 33, 0, 28, 5, 1, 32, 18, 5, 9, 0, 26, 5, 1, 8, 22, 5, 129, 0, 64, 5, 0, 0, 16, 5, 2, 0, 23, 5, 129, 1, 19, 5, 25, 0, 27, 5, 1, 24, 17, 5, 7, 0, 25, 5, 1, 6, 21, 5, 97, 0, 29, 5, 1, 96, 16, 5, 4, 0, 24, 5, 1, 3, 20, 5, 49, 0, 28, 5, 1, 48, 18, 5, 13, 0, 26, 5, 1, 12, 22, 5, 193, 0, 64, 5, 0, 0, 3, 0, 4, 0, 5, 0, 6, 0, 7, 0, 8, 0, 9, 0, 10, 0, 11, 0, 13, 0, 15, 0, 17, 
            0, 19, 0, 23, 0, 27, 0, 31, 0, 35, 0, 43, 0, 51, 0, 59, 0, 67, 0, 83, 0, 99, 0, 115, 0, 131, 0, 163, 0, 195, 0, 227, 0, 2, 1, 0, 0, 0, 0, 0, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 17, 0, 17, 0, 17, 0, 18, 0, 18, 0, 18, 0, 18, 0, 19, 0, 19, 0, 19, 0, 19, 0, 20, 0, 20, 0, 20, 0, 20, 0, 21, 0, 21, 0, 21, 0, 21, 0, 16, 0, 72, 0, 78, 0, 0, 0, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 7, 0, 9, 0, 13, 0, 17, 0, 25, 0, 33, 0, 49, 0, 65, 0, 97, 0, 129, 0, 193, 0, 1, 1, 129, 1, 1, 2, 1, 3, 1, 4, 1, 6, 1, 8, 1, 12, 1, 16, 1, 24, 1, 32, 1, 48, 1, 64, 1, 96, 0, 0, 0, 0, 16, 0, 16, 0, 16, 0, 16, 0, 17, 0, 17, 0, 18, 0, 18, 0, 19, 0, 19, 0, 20, 0, 20, 0, 21, 0, 21, 0, 22, 0, 22, 0, 23, 0, 23, 0, 24, 
            0, 24, 0, 25, 0, 25, 0, 26, 0, 26, 0, 27, 0, 27, 0, 28, 0, 28, 0, 29, 0, 29, 0, 64, 0, 64, 0, 0, 1, 2, 3, 4, 4, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 0, 0, 16, 17, 18, 18, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 
            26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 
            29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 29, 0, 1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 12, 12, 13, 13, 13, 13, 14, 14, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
            24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 27, 28, 184, 15, 0, 0, 176, 20, 0, 0, 1, 1, 0, 0, 30, 1, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 56, 20, 0, 0, 160, 21, 0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 168, 22, 0, 0, 0, 0, 0, 0, 19, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 12, 0, 8, 0, 140, 0, 8, 0, 76, 
            0, 8, 0, 204, 0, 8, 0, 44, 0, 8, 0, 172, 0, 8, 0, 108, 0, 8, 0, 236, 0, 8, 0, 28, 0, 8, 0, 156, 0, 8, 0, 92, 0, 8, 0, 220, 0, 8, 0, 60, 0, 8, 0, 188, 0, 8, 0, 124, 0, 8, 0, 252, 0, 8, 0, 2, 0, 8, 0, 130, 0, 8, 0, 66, 0, 8, 0, 194, 0, 8, 0, 34, 0, 8, 0, 162, 0, 8, 0, 98, 0, 8, 0, 226, 0, 8, 0, 18, 0, 8, 0, 146, 0, 8, 0, 82, 0, 8, 0, 210, 0, 8, 0, 50, 0, 8, 0, 178, 0, 8, 0, 114, 0, 8, 0, 242, 0, 8, 0, 10, 0, 8, 0, 138, 0, 8, 0, 74, 0, 8, 0, 202, 0, 8, 0, 42, 0, 8, 0, 170, 0, 8, 0, 106, 0, 8, 0, 234, 0, 8, 0, 26, 0, 8, 0, 154, 0, 8, 0, 90, 0, 8, 0, 218, 0, 8, 0, 58, 0, 8, 0, 186, 0, 8, 0, 122, 0, 8, 0, 250, 0, 8, 0, 6, 0, 8, 0, 134, 0, 8, 0, 70, 0, 8, 0, 198, 0, 8, 0, 38, 0, 8, 0, 166, 0, 8, 0, 102, 0, 8, 
            0, 230, 0, 8, 0, 22, 0, 8, 0, 150, 0, 8, 0, 86, 0, 8, 0, 214, 0, 8, 0, 54, 0, 8, 0, 182, 0, 8, 0, 118, 0, 8, 0, 246, 0, 8, 0, 14, 0, 8, 0, 142, 0, 8, 0, 78, 0, 8, 0, 206, 0, 8, 0, 46, 0, 8, 0, 174, 0, 8, 0, 110, 0, 8, 0, 238, 0, 8, 0, 30, 0, 8, 0, 158, 0, 8, 0, 94, 0, 8, 0, 222, 0, 8, 0, 62, 0, 8, 0, 190, 0, 8, 0, 126, 0, 8, 0, 254, 0, 8, 0, 1, 0, 8, 0, 129, 0, 8, 0, 65, 0, 8, 0, 193, 0, 8, 0, 33, 0, 8, 0, 161, 0, 8, 0, 97, 0, 8, 0, 225, 0, 8, 0, 17, 0, 8, 0, 145, 0, 8, 0, 81, 0, 8, 0, 209, 0, 8, 0, 49, 0, 8, 0, 177, 0, 8, 0, 113, 0, 8, 0, 241, 0, 8, 0, 9, 0, 8, 0, 137, 0, 8, 0, 73, 0, 8, 0, 201, 0, 8, 0, 41, 0, 8, 0, 169, 0, 8, 0, 105, 0, 8, 0, 233, 0, 8, 0, 25, 0, 8, 0, 153, 0, 8, 0, 89, 0, 8, 0, 217, 
            0, 8, 0, 57, 0, 8, 0, 185, 0, 8, 0, 121, 0, 8, 0, 249, 0, 8, 0, 5, 0, 8, 0, 133, 0, 8, 0, 69, 0, 8, 0, 197, 0, 8, 0, 37, 0, 8, 0, 165, 0, 8, 0, 101, 0, 8, 0, 229, 0, 8, 0, 21, 0, 8, 0, 149, 0, 8, 0, 85, 0, 8, 0, 213, 0, 8, 0, 53, 0, 8, 0, 181, 0, 8, 0, 117, 0, 8, 0, 245, 0, 8, 0, 13, 0, 8, 0, 141, 0, 8, 0, 77, 0, 8, 0, 205, 0, 8, 0, 45, 0, 8, 0, 173, 0, 8, 0, 109, 0, 8, 0, 237, 0, 8, 0, 29, 0, 8, 0, 157, 0, 8, 0, 93, 0, 8, 0, 221, 0, 8, 0, 61, 0, 8, 0, 189, 0, 8, 0, 125, 0, 8, 0, 253, 0, 8, 0, 19, 0, 9, 0, 19, 1, 9, 0, 147, 0, 9, 0, 147, 1, 9, 0, 83, 0, 9, 0, 83, 1, 9, 0, 211, 0, 9, 0, 211, 1, 9, 0, 51, 0, 9, 0, 51, 1, 9, 0, 179, 0, 9, 0, 179, 1, 9, 0, 115, 0, 9, 0, 115, 1, 9, 0, 243, 0, 9, 0, 243, 1, 
            9, 0, 11, 0, 9, 0, 11, 1, 9, 0, 139, 0, 9, 0, 139, 1, 9, 0, 75, 0, 9, 0, 75, 1, 9, 0, 203, 0, 9, 0, 203, 1, 9, 0, 43, 0, 9, 0, 43, 1, 9, 0, 171, 0, 9, 0, 171, 1, 9, 0, 107, 0, 9, 0, 107, 1, 9, 0, 235, 0, 9, 0, 235, 1, 9, 0, 27, 0, 9, 0, 27, 1, 9, 0, 155, 0, 9, 0, 155, 1, 9, 0, 91, 0, 9, 0, 91, 1, 9, 0, 219, 0, 9, 0, 219, 1, 9, 0, 59, 0, 9, 0, 59, 1, 9, 0, 187, 0, 9, 0, 187, 1, 9, 0, 123, 0, 9, 0, 123, 1, 9, 0, 251, 0, 9, 0, 251, 1, 9, 0, 7, 0, 9, 0, 7, 1, 9, 0, 135, 0, 9, 0, 135, 1, 9, 0, 71, 0, 9, 0, 71, 1, 9, 0, 199, 0, 9, 0, 199, 1, 9, 0, 39, 0, 9, 0, 39, 1, 9, 0, 167, 0, 9, 0, 167, 1, 9, 0, 103, 0, 9, 0, 103, 1, 9, 0, 231, 0, 9, 0, 231, 1, 9, 0, 23, 0, 9, 0, 23, 1, 9, 0, 151, 0, 9, 0, 151, 1, 9, 0, 
            87, 0, 9, 0, 87, 1, 9, 0, 215, 0, 9, 0, 215, 1, 9, 0, 55, 0, 9, 0, 55, 1, 9, 0, 183, 0, 9, 0, 183, 1, 9, 0, 119, 0, 9, 0, 119, 1, 9, 0, 247, 0, 9, 0, 247, 1, 9, 0, 15, 0, 9, 0, 15, 1, 9, 0, 143, 0, 9, 0, 143, 1, 9, 0, 79, 0, 9, 0, 79, 1, 9, 0, 207, 0, 9, 0, 207, 1, 9, 0, 47, 0, 9, 0, 47, 1, 9, 0, 175, 0, 9, 0, 175, 1, 9, 0, 111, 0, 9, 0, 111, 1, 9, 0, 239, 0, 9, 0, 239, 1, 9, 0, 31, 0, 9, 0, 31, 1, 9, 0, 159, 0, 9, 0, 159, 1, 9, 0, 95, 0, 9, 0, 95, 1, 9, 0, 223, 0, 9, 0, 223, 1, 9, 0, 63, 0, 9, 0, 63, 1, 9, 0, 191, 0, 9, 0, 191, 1, 9, 0, 127, 0, 9, 0, 127, 1, 9, 0, 255, 0, 9, 0, 255, 1, 9, 0, 0, 0, 7, 0, 64, 0, 7, 0, 32, 0, 7, 0, 96, 0, 7, 0, 16, 0, 7, 0, 80, 0, 7, 0, 48, 0, 7, 0, 112, 0, 7, 0, 8, 0, 7, 
            0, 72, 0, 7, 0, 40, 0, 7, 0, 104, 0, 7, 0, 24, 0, 7, 0, 88, 0, 7, 0, 56, 0, 7, 0, 120, 0, 7, 0, 4, 0, 7, 0, 68, 0, 7, 0, 36, 0, 7, 0, 100, 0, 7, 0, 20, 0, 7, 0, 84, 0, 7, 0, 52, 0, 7, 0, 116, 0, 7, 0, 3, 0, 8, 0, 131, 0, 8, 0, 67, 0, 8, 0, 195, 0, 8, 0, 35, 0, 8, 0, 163, 0, 8, 0, 99, 0, 8, 0, 227, 0, 8, 0, 0, 0, 5, 0, 16, 0, 5, 0, 8, 0, 5, 0, 24, 0, 5, 0, 4, 0, 5, 0, 20, 0, 5, 0, 12, 0, 5, 0, 28, 0, 5, 0, 2, 0, 5, 0, 18, 0, 5, 0, 10, 0, 5, 0, 26, 0, 5, 0, 6, 0, 5, 0, 22, 0, 5, 0, 14, 0, 5, 0, 30, 0, 5, 0, 1, 0, 5, 0, 17, 0, 5, 0, 9, 0, 5, 0, 25, 0, 5, 0, 5, 0, 5, 0, 21, 0, 5, 0, 13, 0, 5, 0, 29, 0, 5, 0, 3, 0, 5, 0, 19, 0, 5, 0, 11, 0, 5, 0, 27, 0, 5, 0, 7, 0, 5, 0, 23, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 10, 0, 0, 0, 12, 0, 0, 0, 14, 0, 0, 0, 16, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 28, 0, 0, 0, 32, 0, 0, 0, 40, 0, 0, 0, 48, 0, 0, 0, 56, 0, 0, 0, 64, 0, 0, 0, 80, 0, 0, 0, 96, 0, 0, 0, 112, 0, 0, 0, 128, 0, 0, 0, 160, 0, 0, 0, 192, 0, 0, 0, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 4, 0, 0, 0, 5, 0, 0, 0, 5, 0, 0, 0, 6, 0, 0, 0, 6, 0, 0, 0, 7, 0, 0, 0, 7, 0, 0, 0, 8, 0, 0, 0, 8, 0, 0, 0, 9, 0, 0, 0, 9, 0, 0, 0, 10, 0, 0, 0, 10, 0, 0, 0, 11, 0, 0, 0, 11, 0, 0, 0, 12, 0, 0, 0, 12, 0, 0, 0, 13, 0, 0, 0, 13, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 16, 0, 0, 0, 24, 0, 0, 0, 32, 0, 0, 0, 48, 0, 0, 0, 64, 0, 0, 0, 96, 0, 0, 0, 128, 0, 0, 0, 192, 0, 0, 0, 0, 1, 0, 0, 128, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0, 0, 6, 0, 0, 0, 8, 0, 0, 0, 12, 0, 0, 0, 16, 0, 0, 0, 24, 0, 0, 0, 32, 0, 0, 0, 48, 0, 0, 0, 64, 0, 0, 0, 96, 0, 0, 16, 17, 18, 0, 8, 7, 9, 
            6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 7, 0, 0, 0, 0, 0, 0, 0, 115, 116, 114, 101, 97, 109, 32, 101, 114, 114, 111, 114, 0, 0, 0, 0, 105, 110, 115, 117, 102, 102, 105, 99, 105, 101, 110, 116, 32, 109, 101, 109, 111, 114, 121, 0, 0, 0, 0, 0, 98, 117, 102, 102, 101, 114, 32, 101, 114, 114, 111, 114, 0, 0, 0, 0, 0, 0, 0, 0, 150, 48, 7, 119, 44, 97, 14, 238, 186, 81, 9, 153, 25, 196, 109, 7, 143, 244, 106, 112, 53, 165, 99, 233, 163, 149, 100, 158, 50, 
            136, 219, 14, 164, 184, 220, 121, 30, 233, 213, 224, 136, 217, 210, 151, 43, 76, 182, 9, 189, 124, 177, 126, 7, 45, 184, 231, 145, 29, 191, 144, 100, 16, 183, 29, 242, 32, 176, 106, 72, 113, 185, 243, 222, 65, 190, 132, 125, 212, 218, 26, 235, 228, 221, 109, 81, 181, 212, 244, 199, 133, 211, 131, 86, 152, 108, 19, 192, 168, 107, 100, 122, 249, 98, 253, 236, 201, 101, 138, 79, 92, 1, 20, 217, 108, 6, 99, 99, 61, 15, 250, 245, 13, 8, 141, 200, 32, 110, 59, 94, 16, 105, 76, 228, 65, 96, 213, 114, 113, 103, 162, 209, 228, 3, 60, 71, 212, 4, 75, 253, 133, 13, 210, 107, 181, 10, 165, 250, 168, 181, 53, 108, 152, 178, 66, 214, 201, 187, 219, 
            64, 249, 188, 172, 227, 108, 216, 50, 117, 92, 223, 69, 207, 13, 214, 220, 89, 61, 209, 171, 172, 48, 217, 38, 58, 0, 222, 81, 128, 81, 215, 200, 22, 97, 208, 191, 181, 244, 180, 33, 35, 196, 179, 86, 153, 149, 186, 207, 15, 165, 189, 184, 158, 184, 2, 40, 8, 136, 5, 95, 178, 217, 12, 198, 36, 233, 11, 177, 135, 124, 111, 47, 17, 76, 104, 88, 171, 29, 97, 193, 61, 45, 102, 182, 144, 65, 220, 118, 6, 113, 219, 1, 188, 32, 210, 152, 42, 16, 213, 239, 137, 133, 177, 113, 31, 181, 182, 6, 165, 228, 191, 159, 51, 212, 184, 232, 162, 201, 7, 120, 52, 249, 0, 15, 142, 168, 9, 150, 24, 152, 14, 225, 187, 13, 106, 127, 45, 61, 109, 8, 151, 108, 
            100, 145, 1, 92, 99, 230, 244, 81, 107, 107, 98, 97, 108, 28, 216, 48, 101, 133, 78, 0, 98, 242, 237, 149, 6, 108, 123, 165, 1, 27, 193, 244, 8, 130, 87, 196, 15, 245, 198, 217, 176, 101, 80, 233, 183, 18, 234, 184, 190, 139, 124, 136, 185, 252, 223, 29, 221, 98, 73, 45, 218, 21, 243, 124, 211, 140, 101, 76, 212, 251, 88, 97, 178, 77, 206, 81, 181, 58, 116, 0, 188, 163, 226, 48, 187, 212, 65, 165, 223, 74, 215, 149, 216, 61, 109, 196, 209, 164, 251, 244, 214, 211, 106, 233, 105, 67, 252, 217, 110, 52, 70, 136, 103, 173, 208, 184, 96, 218, 115, 45, 4, 68, 229, 29, 3, 51, 95, 76, 10, 170, 201, 124, 13, 221, 60, 113, 5, 80, 170, 65, 2, 39, 
            16, 16, 11, 190, 134, 32, 12, 201, 37, 181, 104, 87, 179, 133, 111, 32, 9, 212, 102, 185, 159, 228, 97, 206, 14, 249, 222, 94, 152, 201, 217, 41, 34, 152, 208, 176, 180, 168, 215, 199, 23, 61, 179, 89, 129, 13, 180, 46, 59, 92, 189, 183, 173, 108, 186, 192, 32, 131, 184, 237, 182, 179, 191, 154, 12, 226, 182, 3, 154, 210, 177, 116, 57, 71, 213, 234, 175, 119, 210, 157, 21, 38, 219, 4, 131, 22, 220, 115, 18, 11, 99, 227, 132, 59, 100, 148, 62, 106, 109, 13, 168, 90, 106, 122, 11, 207, 14, 228, 157, 255, 9, 147, 39, 174, 0, 10, 177, 158, 7, 125, 68, 147, 15, 240, 210, 163, 8, 135, 104, 242, 1, 30, 254, 194, 6, 105, 93, 87, 98, 247, 203, 
            103, 101, 128, 113, 54, 108, 25, 231, 6, 107, 110, 118, 27, 212, 254, 224, 43, 211, 137, 90, 122, 218, 16, 204, 74, 221, 103, 111, 223, 185, 249, 249, 239, 190, 142, 67, 190, 183, 23, 213, 142, 176, 96, 232, 163, 214, 214, 126, 147, 209, 161, 196, 194, 216, 56, 82, 242, 223, 79, 241, 103, 187, 209, 103, 87, 188, 166, 221, 6, 181, 63, 75, 54, 178, 72, 218, 43, 13, 216, 76, 27, 10, 175, 246, 74, 3, 54, 96, 122, 4, 65, 195, 239, 96, 223, 85, 223, 103, 168, 239, 142, 110, 49, 121, 190, 105, 70, 140, 179, 97, 203, 26, 131, 102, 188, 160, 210, 111, 37, 54, 226, 104, 82, 149, 119, 12, 204, 3, 71, 11, 187, 185, 22, 2, 34, 47, 38, 5, 85, 190, 
            59, 186, 197, 40, 11, 189, 178, 146, 90, 180, 43, 4, 106, 179, 92, 167, 255, 215, 194, 49, 207, 208, 181, 139, 158, 217, 44, 29, 174, 222, 91, 176, 194, 100, 155, 38, 242, 99, 236, 156, 163, 106, 117, 10, 147, 109, 2, 169, 6, 9, 156, 63, 54, 14, 235, 133, 103, 7, 114, 19, 87, 0, 5, 130, 74, 191, 149, 20, 122, 184, 226, 174, 43, 177, 123, 56, 27, 182, 12, 155, 142, 210, 146, 13, 190, 213, 229, 183, 239, 220, 124, 33, 223, 219, 11, 212, 210, 211, 134, 66, 226, 212, 241, 248, 179, 221, 104, 110, 131, 218, 31, 205, 22, 190, 129, 91, 38, 185, 246, 225, 119, 176, 111, 119, 71, 183, 24, 230, 90, 8, 136, 112, 106, 15, 255, 202, 59, 6, 102, 
            92, 11, 1, 17, 255, 158, 101, 143, 105, 174, 98, 248, 211, 255, 107, 97, 69, 207, 108, 22, 120, 226, 10, 160, 238, 210, 13, 215, 84, 131, 4, 78, 194, 179, 3, 57, 97, 38, 103, 167, 247, 22, 96, 208, 77, 71, 105, 73, 219, 119, 110, 62, 74, 106, 209, 174, 220, 90, 214, 217, 102, 11, 223, 64, 240, 59, 216, 55, 83, 174, 188, 169, 197, 158, 187, 222, 127, 207, 178, 71, 233, 255, 181, 48, 28, 242, 189, 189, 138, 194, 186, 202, 48, 147, 179, 83, 166, 163, 180, 36, 5, 54, 208, 186, 147, 6, 215, 205, 41, 87, 222, 84, 191, 103, 217, 35, 46, 122, 102, 179, 184, 74, 97, 196, 2, 27, 104, 93, 148, 43, 111, 42, 55, 190, 11, 180, 161, 142, 12, 195, 27, 
            223, 5, 90, 141, 239, 2, 45, 0, 0, 0, 0, 65, 49, 27, 25, 130, 98, 54, 50, 195, 83, 45, 43, 4, 197, 108, 100, 69, 244, 119, 125, 134, 167, 90, 86, 199, 150, 65, 79, 8, 138, 217, 200, 73, 187, 194, 209, 138, 232, 239, 250, 203, 217, 244, 227, 12, 79, 181, 172, 77, 126, 174, 181, 142, 45, 131, 158, 207, 28, 152, 135, 81, 18, 194, 74, 16, 35, 217, 83, 211, 112, 244, 120, 146, 65, 239, 97, 85, 215, 174, 46, 20, 230, 181, 55, 215, 181, 152, 28, 150, 132, 131, 5, 89, 152, 27, 130, 24, 169, 0, 155, 219, 250, 45, 176, 154, 203, 54, 169, 93, 93, 119, 230, 28, 108, 108, 255, 223, 63, 65, 212, 158, 14, 90, 205, 162, 36, 132, 149, 227, 21, 159, 140, 
            32, 70, 178, 167, 97, 119, 169, 190, 166, 225, 232, 241, 231, 208, 243, 232, 36, 131, 222, 195, 101, 178, 197, 218, 170, 174, 93, 93, 235, 159, 70, 68, 40, 204, 107, 111, 105, 253, 112, 118, 174, 107, 49, 57, 239, 90, 42, 32, 44, 9, 7, 11, 109, 56, 28, 18, 243, 54, 70, 223, 178, 7, 93, 198, 113, 84, 112, 237, 48, 101, 107, 244, 247, 243, 42, 187, 182, 194, 49, 162, 117, 145, 28, 137, 52, 160, 7, 144, 251, 188, 159, 23, 186, 141, 132, 14, 121, 222, 169, 37, 56, 239, 178, 60, 255, 121, 243, 115, 190, 72, 232, 106, 125, 27, 197, 65, 60, 42, 222, 88, 5, 79, 121, 240, 68, 126, 98, 233, 135, 45, 79, 194, 198, 28, 84, 219, 1, 138, 21, 148, 
            64, 187, 14, 141, 131, 232, 35, 166, 194, 217, 56, 191, 13, 197, 160, 56, 76, 244, 187, 33, 143, 167, 150, 10, 206, 150, 141, 19, 9, 0, 204, 92, 72, 49, 215, 69, 139, 98, 250, 110, 202, 83, 225, 119, 84, 93, 187, 186, 21, 108, 160, 163, 214, 63, 141, 136, 151, 14, 150, 145, 80, 152, 215, 222, 17, 169, 204, 199, 210, 250, 225, 236, 147, 203, 250, 245, 92, 215, 98, 114, 29, 230, 121, 107, 222, 181, 84, 64, 159, 132, 79, 89, 88, 18, 14, 22, 25, 35, 21, 15, 218, 112, 56, 36, 155, 65, 35, 61, 167, 107, 253, 101, 230, 90, 230, 124, 37, 9, 203, 87, 100, 56, 208, 78, 163, 174, 145, 1, 226, 159, 138, 24, 33, 204, 167, 51, 96, 253, 188, 42, 175, 
            225, 36, 173, 238, 208, 63, 180, 45, 131, 18, 159, 108, 178, 9, 134, 171, 36, 72, 201, 234, 21, 83, 208, 41, 70, 126, 251, 104, 119, 101, 226, 246, 121, 63, 47, 183, 72, 36, 54, 116, 27, 9, 29, 53, 42, 18, 4, 242, 188, 83, 75, 179, 141, 72, 82, 112, 222, 101, 121, 49, 239, 126, 96, 254, 243, 230, 231, 191, 194, 253, 254, 124, 145, 208, 213, 61, 160, 203, 204, 250, 54, 138, 131, 187, 7, 145, 154, 120, 84, 188, 177, 57, 101, 167, 168, 75, 152, 131, 59, 10, 169, 152, 34, 201, 250, 181, 9, 136, 203, 174, 16, 79, 93, 239, 95, 14, 108, 244, 70, 205, 63, 217, 109, 140, 14, 194, 116, 67, 18, 90, 243, 2, 35, 65, 234, 193, 112, 108, 193, 128, 
            65, 119, 216, 71, 215, 54, 151, 6, 230, 45, 142, 197, 181, 0, 165, 132, 132, 27, 188, 26, 138, 65, 113, 91, 187, 90, 104, 152, 232, 119, 67, 217, 217, 108, 90, 30, 79, 45, 21, 95, 126, 54, 12, 156, 45, 27, 39, 221, 28, 0, 62, 18, 0, 152, 185, 83, 49, 131, 160, 144, 98, 174, 139, 209, 83, 181, 146, 22, 197, 244, 221, 87, 244, 239, 196, 148, 167, 194, 239, 213, 150, 217, 246, 233, 188, 7, 174, 168, 141, 28, 183, 107, 222, 49, 156, 42, 239, 42, 133, 237, 121, 107, 202, 172, 72, 112, 211, 111, 27, 93, 248, 46, 42, 70, 225, 225, 54, 222, 102, 160, 7, 197, 127, 99, 84, 232, 84, 34, 101, 243, 77, 229, 243, 178, 2, 164, 194, 169, 27, 103, 145, 
            132, 48, 38, 160, 159, 41, 184, 174, 197, 228, 249, 159, 222, 253, 58, 204, 243, 214, 123, 253, 232, 207, 188, 107, 169, 128, 253, 90, 178, 153, 62, 9, 159, 178, 127, 56, 132, 171, 176, 36, 28, 44, 241, 21, 7, 53, 50, 70, 42, 30, 115, 119, 49, 7, 180, 225, 112, 72, 245, 208, 107, 81, 54, 131, 70, 122, 119, 178, 93, 99, 78, 215, 250, 203, 15, 230, 225, 210, 204, 181, 204, 249, 141, 132, 215, 224, 74, 18, 150, 175, 11, 35, 141, 182, 200, 112, 160, 157, 137, 65, 187, 132, 70, 93, 35, 3, 7, 108, 56, 26, 196, 63, 21, 49, 133, 14, 14, 40, 66, 152, 79, 103, 3, 169, 84, 126, 192, 250, 121, 85, 129, 203, 98, 76, 31, 197, 56, 129, 94, 244, 35, 
            152, 157, 167, 14, 179, 220, 150, 21, 170, 27, 0, 84, 229, 90, 49, 79, 252, 153, 98, 98, 215, 216, 83, 121, 206, 23, 79, 225, 73, 86, 126, 250, 80, 149, 45, 215, 123, 212, 28, 204, 98, 19, 138, 141, 45, 82, 187, 150, 52, 145, 232, 187, 31, 208, 217, 160, 6, 236, 243, 126, 94, 173, 194, 101, 71, 110, 145, 72, 108, 47, 160, 83, 117, 232, 54, 18, 58, 169, 7, 9, 35, 106, 84, 36, 8, 43, 101, 63, 17, 228, 121, 167, 150, 165, 72, 188, 143, 102, 27, 145, 164, 39, 42, 138, 189, 224, 188, 203, 242, 161, 141, 208, 235, 98, 222, 253, 192, 35, 239, 230, 217, 189, 225, 188, 20, 252, 208, 167, 13, 63, 131, 138, 38, 126, 178, 145, 63, 185, 36, 208, 
            112, 248, 21, 203, 105, 59, 70, 230, 66, 122, 119, 253, 91, 181, 107, 101, 220, 244, 90, 126, 197, 55, 9, 83, 238, 118, 56, 72, 247, 177, 174, 9, 184, 240, 159, 18, 161, 51, 204, 63, 138, 114, 253, 36, 147, 0, 0, 0, 0, 55, 106, 194, 1, 110, 212, 132, 3, 89, 190, 70, 2, 220, 168, 9, 7, 235, 194, 203, 6, 178, 124, 141, 4, 133, 22, 79, 5, 184, 81, 19, 14, 143, 59, 209, 15, 214, 133, 151, 13, 225, 239, 85, 12, 100, 249, 26, 9, 83, 147, 216, 8, 10, 45, 158, 10, 61, 71, 92, 11, 112, 163, 38, 28, 71, 201, 228, 29, 30, 119, 162, 31, 41, 29, 96, 30, 172, 11, 47, 27, 155, 97, 237, 26, 194, 223, 171, 24, 245, 181, 105, 25, 200, 242, 53, 18, 255, 152, 
            247, 19, 166, 38, 177, 17, 145, 76, 115, 16, 20, 90, 60, 21, 35, 48, 254, 20, 122, 142, 184, 22, 77, 228, 122, 23, 224, 70, 77, 56, 215, 44, 143, 57, 142, 146, 201, 59, 185, 248, 11, 58, 60, 238, 68, 63, 11, 132, 134, 62, 82, 58, 192, 60, 101, 80, 2, 61, 88, 23, 94, 54, 111, 125, 156, 55, 54, 195, 218, 53, 1, 169, 24, 52, 132, 191, 87, 49, 179, 213, 149, 48, 234, 107, 211, 50, 221, 1, 17, 51, 144, 229, 107, 36, 167, 143, 169, 37, 254, 49, 239, 39, 201, 91, 45, 38, 76, 77, 98, 35, 123, 39, 160, 34, 34, 153, 230, 32, 21, 243, 36, 33, 40, 180, 120, 42, 31, 222, 186, 43, 70, 96, 252, 41, 113, 10, 62, 40, 244, 28, 113, 45, 195, 118, 179, 44, 154, 
            200, 245, 46, 173, 162, 55, 47, 192, 141, 154, 112, 247, 231, 88, 113, 174, 89, 30, 115, 153, 51, 220, 114, 28, 37, 147, 119, 43, 79, 81, 118, 114, 241, 23, 116, 69, 155, 213, 117, 120, 220, 137, 126, 79, 182, 75, 127, 22, 8, 13, 125, 33, 98, 207, 124, 164, 116, 128, 121, 147, 30, 66, 120, 202, 160, 4, 122, 253, 202, 198, 123, 176, 46, 188, 108, 135, 68, 126, 109, 222, 250, 56, 111, 233, 144, 250, 110, 108, 134, 181, 107, 91, 236, 119, 106, 2, 82, 49, 104, 53, 56, 243, 105, 8, 127, 175, 98, 63, 21, 109, 99, 102, 171, 43, 97, 81, 193, 233, 96, 212, 215, 166, 101, 227, 189, 100, 100, 186, 3, 34, 102, 141, 105, 224, 103, 32, 203, 215, 
            72, 23, 161, 21, 73, 78, 31, 83, 75, 121, 117, 145, 74, 252, 99, 222, 79, 203, 9, 28, 78, 146, 183, 90, 76, 165, 221, 152, 77, 152, 154, 196, 70, 175, 240, 6, 71, 246, 78, 64, 69, 193, 36, 130, 68, 68, 50, 205, 65, 115, 88, 15, 64, 42, 230, 73, 66, 29, 140, 139, 67, 80, 104, 241, 84, 103, 2, 51, 85, 62, 188, 117, 87, 9, 214, 183, 86, 140, 192, 248, 83, 187, 170, 58, 82, 226, 20, 124, 80, 213, 126, 190, 81, 232, 57, 226, 90, 223, 83, 32, 91, 134, 237, 102, 89, 177, 135, 164, 88, 52, 145, 235, 93, 3, 251, 41, 92, 90, 69, 111, 94, 109, 47, 173, 95, 128, 27, 53, 225, 183, 113, 247, 224, 238, 207, 177, 226, 217, 165, 115, 227, 92, 179, 60, 230, 
            107, 217, 254, 231, 50, 103, 184, 229, 5, 13, 122, 228, 56, 74, 38, 239, 15, 32, 228, 238, 86, 158, 162, 236, 97, 244, 96, 237, 228, 226, 47, 232, 211, 136, 237, 233, 138, 54, 171, 235, 189, 92, 105, 234, 240, 184, 19, 253, 199, 210, 209, 252, 158, 108, 151, 254, 169, 6, 85, 255, 44, 16, 26, 250, 27, 122, 216, 251, 66, 196, 158, 249, 117, 174, 92, 248, 72, 233, 0, 243, 127, 131, 194, 242, 38, 61, 132, 240, 17, 87, 70, 241, 148, 65, 9, 244, 163, 43, 203, 245, 250, 149, 141, 247, 205, 255, 79, 246, 96, 93, 120, 217, 87, 55, 186, 216, 14, 137, 252, 218, 57, 227, 62, 219, 188, 245, 113, 222, 139, 159, 179, 223, 210, 33, 245, 221, 229, 
            75, 55, 220, 216, 12, 107, 215, 239, 102, 169, 214, 182, 216, 239, 212, 129, 178, 45, 213, 4, 164, 98, 208, 51, 206, 160, 209, 106, 112, 230, 211, 93, 26, 36, 210, 16, 254, 94, 197, 39, 148, 156, 196, 126, 42, 218, 198, 73, 64, 24, 199, 204, 86, 87, 194, 251, 60, 149, 195, 162, 130, 211, 193, 149, 232, 17, 192, 168, 175, 77, 203, 159, 197, 143, 202, 198, 123, 201, 200, 241, 17, 11, 201, 116, 7, 68, 204, 67, 109, 134, 205, 26, 211, 192, 207, 45, 185, 2, 206, 64, 150, 175, 145, 119, 252, 109, 144, 46, 66, 43, 146, 25, 40, 233, 147, 156, 62, 166, 150, 171, 84, 100, 151, 242, 234, 34, 149, 197, 128, 224, 148, 248, 199, 188, 159, 207, 
            173, 126, 158, 150, 19, 56, 156, 161, 121, 250, 157, 36, 111, 181, 152, 19, 5, 119, 153, 74, 187, 49, 155, 125, 209, 243, 154, 48, 53, 137, 141, 7, 95, 75, 140, 94, 225, 13, 142, 105, 139, 207, 143, 236, 157, 128, 138, 219, 247, 66, 139, 130, 73, 4, 137, 181, 35, 198, 136, 136, 100, 154, 131, 191, 14, 88, 130, 230, 176, 30, 128, 209, 218, 220, 129, 84, 204, 147, 132, 99, 166, 81, 133, 58, 24, 23, 135, 13, 114, 213, 134, 160, 208, 226, 169, 151, 186, 32, 168, 206, 4, 102, 170, 249, 110, 164, 171, 124, 120, 235, 174, 75, 18, 41, 175, 18, 172, 111, 173, 37, 198, 173, 172, 24, 129, 241, 167, 47, 235, 51, 166, 118, 85, 117, 164, 65, 63, 
            183, 165, 196, 41, 248, 160, 243, 67, 58, 161, 170, 253, 124, 163, 157, 151, 190, 162, 208, 115, 196, 181, 231, 25, 6, 180, 190, 167, 64, 182, 137, 205, 130, 183, 12, 219, 205, 178, 59, 177, 15, 179, 98, 15, 73, 177, 85, 101, 139, 176, 104, 34, 215, 187, 95, 72, 21, 186, 6, 246, 83, 184, 49, 156, 145, 185, 180, 138, 222, 188, 131, 224, 28, 189, 218, 94, 90, 191, 237, 52, 152, 190, 0, 0, 0, 0, 101, 103, 188, 184, 139, 200, 9, 170, 238, 175, 181, 18, 87, 151, 98, 143, 50, 240, 222, 55, 220, 95, 107, 37, 185, 56, 215, 157, 239, 40, 180, 197, 138, 79, 8, 125, 100, 224, 189, 111, 1, 135, 1, 215, 184, 191, 214, 74, 221, 216, 106, 242, 51, 
            119, 223, 224, 86, 16, 99, 88, 159, 87, 25, 80, 250, 48, 165, 232, 20, 159, 16, 250, 113, 248, 172, 66, 200, 192, 123, 223, 173, 167, 199, 103, 67, 8, 114, 117, 38, 111, 206, 205, 112, 127, 173, 149, 21, 24, 17, 45, 251, 183, 164, 63, 158, 208, 24, 135, 39, 232, 207, 26, 66, 143, 115, 162, 172, 32, 198, 176, 201, 71, 122, 8, 62, 175, 50, 160, 91, 200, 142, 24, 181, 103, 59, 10, 208, 0, 135, 178, 105, 56, 80, 47, 12, 95, 236, 151, 226, 240, 89, 133, 135, 151, 229, 61, 209, 135, 134, 101, 180, 224, 58, 221, 90, 79, 143, 207, 63, 40, 51, 119, 134, 16, 228, 234, 227, 119, 88, 82, 13, 216, 237, 64, 104, 191, 81, 248, 161, 248, 43, 240, 196, 
            159, 151, 72, 42, 48, 34, 90, 79, 87, 158, 226, 246, 111, 73, 127, 147, 8, 245, 199, 125, 167, 64, 213, 24, 192, 252, 109, 78, 208, 159, 53, 43, 183, 35, 141, 197, 24, 150, 159, 160, 127, 42, 39, 25, 71, 253, 186, 124, 32, 65, 2, 146, 143, 244, 16, 247, 232, 72, 168, 61, 88, 20, 155, 88, 63, 168, 35, 182, 144, 29, 49, 211, 247, 161, 137, 106, 207, 118, 20, 15, 168, 202, 172, 225, 7, 127, 190, 132, 96, 195, 6, 210, 112, 160, 94, 183, 23, 28, 230, 89, 184, 169, 244, 60, 223, 21, 76, 133, 231, 194, 209, 224, 128, 126, 105, 14, 47, 203, 123, 107, 72, 119, 195, 162, 15, 13, 203, 199, 104, 177, 115, 41, 199, 4, 97, 76, 160, 184, 217, 245, 
            152, 111, 68, 144, 255, 211, 252, 126, 80, 102, 238, 27, 55, 218, 86, 77, 39, 185, 14, 40, 64, 5, 182, 198, 239, 176, 164, 163, 136, 12, 28, 26, 176, 219, 129, 127, 215, 103, 57, 145, 120, 210, 43, 244, 31, 110, 147, 3, 247, 38, 59, 102, 144, 154, 131, 136, 63, 47, 145, 237, 88, 147, 41, 84, 96, 68, 180, 49, 7, 248, 12, 223, 168, 77, 30, 186, 207, 241, 166, 236, 223, 146, 254, 137, 184, 46, 70, 103, 23, 155, 84, 2, 112, 39, 236, 187, 72, 240, 113, 222, 47, 76, 201, 48, 128, 249, 219, 85, 231, 69, 99, 156, 160, 63, 107, 249, 199, 131, 211, 23, 104, 54, 193, 114, 15, 138, 121, 203, 55, 93, 228, 174, 80, 225, 92, 64, 255, 84, 78, 37, 152, 
            232, 246, 115, 136, 139, 174, 22, 239, 55, 22, 248, 64, 130, 4, 157, 39, 62, 188, 36, 31, 233, 33, 65, 120, 85, 153, 175, 215, 224, 139, 202, 176, 92, 51, 59, 182, 89, 237, 94, 209, 229, 85, 176, 126, 80, 71, 213, 25, 236, 255, 108, 33, 59, 98, 9, 70, 135, 218, 231, 233, 50, 200, 130, 142, 142, 112, 212, 158, 237, 40, 177, 249, 81, 144, 95, 86, 228, 130, 58, 49, 88, 58, 131, 9, 143, 167, 230, 110, 51, 31, 8, 193, 134, 13, 109, 166, 58, 181, 164, 225, 64, 189, 193, 134, 252, 5, 47, 41, 73, 23, 74, 78, 245, 175, 243, 118, 34, 50, 150, 17, 158, 138, 120, 190, 43, 152, 29, 217, 151, 32, 75, 201, 244, 120, 46, 174, 72, 192, 192, 1, 253, 210, 
            165, 102, 65, 106, 28, 94, 150, 247, 121, 57, 42, 79, 151, 150, 159, 93, 242, 241, 35, 229, 5, 25, 107, 77, 96, 126, 215, 245, 142, 209, 98, 231, 235, 182, 222, 95, 82, 142, 9, 194, 55, 233, 181, 122, 217, 70, 0, 104, 188, 33, 188, 208, 234, 49, 223, 136, 143, 86, 99, 48, 97, 249, 214, 34, 4, 158, 106, 154, 189, 166, 189, 7, 216, 193, 1, 191, 54, 110, 180, 173, 83, 9, 8, 21, 154, 78, 114, 29, 255, 41, 206, 165, 17, 134, 123, 183, 116, 225, 199, 15, 205, 217, 16, 146, 168, 190, 172, 42, 70, 17, 25, 56, 35, 118, 165, 128, 117, 102, 198, 216, 16, 1, 122, 96, 254, 174, 207, 114, 155, 201, 115, 202, 34, 241, 164, 87, 71, 150, 24, 239, 169, 
            57, 173, 253, 204, 94, 17, 69, 6, 238, 77, 118, 99, 137, 241, 206, 141, 38, 68, 220, 232, 65, 248, 100, 81, 121, 47, 249, 52, 30, 147, 65, 218, 177, 38, 83, 191, 214, 154, 235, 233, 198, 249, 179, 140, 161, 69, 11, 98, 14, 240, 25, 7, 105, 76, 161, 190, 81, 155, 60, 219, 54, 39, 132, 53, 153, 146, 150, 80, 254, 46, 46, 153, 185, 84, 38, 252, 222, 232, 158, 18, 113, 93, 140, 119, 22, 225, 52, 206, 46, 54, 169, 171, 73, 138, 17, 69, 230, 63, 3, 32, 129, 131, 187, 118, 145, 224, 227, 19, 246, 92, 91, 253, 89, 233, 73, 152, 62, 85, 241, 33, 6, 130, 108, 68, 97, 62, 212, 170, 206, 139, 198, 207, 169, 55, 126, 56, 65, 127, 214, 93, 38, 195, 
            110, 179, 137, 118, 124, 214, 238, 202, 196, 111, 214, 29, 89, 10, 177, 161, 225, 228, 30, 20, 243, 129, 121, 168, 75, 215, 105, 203, 19, 178, 14, 119, 171, 92, 161, 194, 185, 57, 198, 126, 1, 128, 254, 169, 156, 229, 153, 21, 36, 11, 54, 160, 54, 110, 81, 28, 142, 167, 22, 102, 134, 194, 113, 218, 62, 44, 222, 111, 44, 73, 185, 211, 148, 240, 129, 4, 9, 149, 230, 184, 177, 123, 73, 13, 163, 30, 46, 177, 27, 72, 62, 210, 67, 45, 89, 110, 251, 195, 246, 219, 233, 166, 145, 103, 81, 31, 169, 176, 204, 122, 206, 12, 116, 148, 97, 185, 102, 241, 6, 5, 222, 0, 0, 0, 0, 119, 7, 48, 150, 238, 14, 97, 44, 153, 9, 81, 186, 7, 109, 196, 25, 112, 
            106, 244, 143, 233, 99, 165, 53, 158, 100, 149, 163, 14, 219, 136, 50, 121, 220, 184, 164, 224, 213, 233, 30, 151, 210, 217, 136, 9, 182, 76, 43, 126, 177, 124, 189, 231, 184, 45, 7, 144, 191, 29, 145, 29, 183, 16, 100, 106, 176, 32, 242, 243, 185, 113, 72, 132, 190, 65, 222, 26, 218, 212, 125, 109, 221, 228, 235, 244, 212, 181, 81, 131, 211, 133, 199, 19, 108, 152, 86, 100, 107, 168, 192, 253, 98, 249, 122, 138, 101, 201, 236, 20, 1, 92, 79, 99, 6, 108, 217, 250, 15, 61, 99, 141, 8, 13, 245, 59, 110, 32, 200, 76, 105, 16, 94, 213, 96, 65, 228, 162, 103, 113, 114, 60, 3, 228, 209, 75, 4, 212, 71, 210, 13, 133, 253, 165, 10, 181, 107, 
            53, 181, 168, 250, 66, 178, 152, 108, 219, 187, 201, 214, 172, 188, 249, 64, 50, 216, 108, 227, 69, 223, 92, 117, 220, 214, 13, 207, 171, 209, 61, 89, 38, 217, 48, 172, 81, 222, 0, 58, 200, 215, 81, 128, 191, 208, 97, 22, 33, 180, 244, 181, 86, 179, 196, 35], "i8", za, w.ab);
        K([207, 186, 149, 153, 184, 189, 165, 15, 40, 2, 184, 158, 95, 5, 136, 8, 198, 12, 217, 178, 177, 11, 233, 36, 47, 111, 124, 135, 88, 104, 76, 17, 193, 97, 29, 171, 182, 102, 45, 61, 118, 220, 65, 144, 1, 219, 113, 6, 152, 210, 32, 188, 239, 213, 16, 42, 113, 177, 133, 137, 6, 182, 181, 31, 159, 191, 228, 165, 232, 184, 212, 51, 120, 7, 201, 162, 15, 0, 249, 52, 150, 9, 168, 142, 225, 14, 152, 24, 127, 106, 13, 187, 8, 109, 61, 45, 145, 100, 108, 151, 230, 99, 92, 1, 107, 107, 81, 244, 28, 108, 97, 98, 133, 101, 48, 216, 242, 98, 0, 78, 108, 6, 149, 237, 27, 1, 165, 123, 130, 8, 244, 193, 245, 15, 196, 87, 101, 176, 217, 198, 18, 183, 
            233, 80, 139, 190, 184, 234, 252, 185, 136, 124, 98, 221, 29, 223, 21, 218, 45, 73, 140, 211, 124, 243, 251, 212, 76, 101, 77, 178, 97, 88, 58, 181, 81, 206, 163, 188, 0, 116, 212, 187, 48, 226, 74, 223, 165, 65, 61, 216, 149, 215, 164, 209, 196, 109, 211, 214, 244, 251, 67, 105, 233, 106, 52, 110, 217, 252, 173, 103, 136, 70, 218, 96, 184, 208, 68, 4, 45, 115, 51, 3, 29, 229, 170, 10, 76, 95, 221, 13, 124, 201, 80, 5, 113, 60, 39, 2, 65, 170, 190, 11, 16, 16, 201, 12, 32, 134, 87, 104, 181, 37, 32, 111, 133, 179, 185, 102, 212, 9, 206, 97, 228, 159, 94, 222, 249, 14, 41, 217, 201, 152, 176, 208, 152, 34, 199, 215, 168, 180, 89, 179, 
            61, 23, 46, 180, 13, 129, 183, 189, 92, 59, 192, 186, 108, 173, 237, 184, 131, 32, 154, 191, 179, 182, 3, 182, 226, 12, 116, 177, 210, 154, 234, 213, 71, 57, 157, 210, 119, 175, 4, 219, 38, 21, 115, 220, 22, 131, 227, 99, 11, 18, 148, 100, 59, 132, 13, 109, 106, 62, 122, 106, 90, 168, 228, 14, 207, 11, 147, 9, 255, 157, 10, 0, 174, 39, 125, 7, 158, 177, 240, 15, 147, 68, 135, 8, 163, 210, 30, 1, 242, 104, 105, 6, 194, 254, 247, 98, 87, 93, 128, 101, 103, 203, 25, 108, 54, 113, 110, 107, 6, 231, 254, 212, 27, 118, 137, 211, 43, 224, 16, 218, 122, 90, 103, 221, 74, 204, 249, 185, 223, 111, 142, 190, 239, 249, 23, 183, 190, 67, 96, 176, 
            142, 213, 214, 214, 163, 232, 161, 209, 147, 126, 56, 216, 194, 196, 79, 223, 242, 82, 209, 187, 103, 241, 166, 188, 87, 103, 63, 181, 6, 221, 72, 178, 54, 75, 216, 13, 43, 218, 175, 10, 27, 76, 54, 3, 74, 246, 65, 4, 122, 96, 223, 96, 239, 195, 168, 103, 223, 85, 49, 110, 142, 239, 70, 105, 190, 121, 203, 97, 179, 140, 188, 102, 131, 26, 37, 111, 210, 160, 82, 104, 226, 54, 204, 12, 119, 149, 187, 11, 71, 3, 34, 2, 22, 185, 85, 5, 38, 47, 197, 186, 59, 190, 178, 189, 11, 40, 43, 180, 90, 146, 92, 179, 106, 4, 194, 215, 255, 167, 181, 208, 207, 49, 44, 217, 158, 139, 91, 222, 174, 29, 155, 100, 194, 176, 236, 99, 242, 38, 117, 106, 163, 
            156, 2, 109, 147, 10, 156, 9, 6, 169, 235, 14, 54, 63, 114, 7, 103, 133, 5, 0, 87, 19, 149, 191, 74, 130, 226, 184, 122, 20, 123, 177, 43, 174, 12, 182, 27, 56, 146, 210, 142, 155, 229, 213, 190, 13, 124, 220, 239, 183, 11, 219, 223, 33, 134, 211, 210, 212, 241, 212, 226, 66, 104, 221, 179, 248, 31, 218, 131, 110, 129, 190, 22, 205, 246, 185, 38, 91, 111, 176, 119, 225, 24, 183, 71, 119, 136, 8, 90, 230, 255, 15, 106, 112, 102, 6, 59, 202, 17, 1, 11, 92, 143, 101, 158, 255, 248, 98, 174, 105, 97, 107, 255, 211, 22, 108, 207, 69, 160, 10, 226, 120, 215, 13, 210, 238, 78, 4, 131, 84, 57, 3, 179, 194, 167, 103, 38, 97, 208, 96, 22, 247, 
            73, 105, 71, 77, 62, 110, 119, 219, 174, 209, 106, 74, 217, 214, 90, 220, 64, 223, 11, 102, 55, 216, 59, 240, 169, 188, 174, 83, 222, 187, 158, 197, 71, 178, 207, 127, 48, 181, 255, 233, 189, 189, 242, 28, 202, 186, 194, 138, 83, 179, 147, 48, 36, 180, 163, 166, 186, 208, 54, 5, 205, 215, 6, 147, 84, 222, 87, 41, 35, 217, 103, 191, 179, 102, 122, 46, 196, 97, 74, 184, 93, 104, 27, 2, 42, 111, 43, 148, 180, 11, 190, 55, 195, 12, 142, 161, 90, 5, 223, 27, 45, 2, 239, 141, 0, 0, 0, 0, 25, 27, 49, 65, 50, 54, 98, 130, 43, 45, 83, 195, 100, 108, 197, 4, 125, 119, 244, 69, 86, 90, 167, 134, 79, 65, 150, 199, 200, 217, 138, 8, 209, 194, 187, 73, 
            250, 239, 232, 138, 227, 244, 217, 203, 172, 181, 79, 12, 181, 174, 126, 77, 158, 131, 45, 142, 135, 152, 28, 207, 74, 194, 18, 81, 83, 217, 35, 16, 120, 244, 112, 211, 97, 239, 65, 146, 46, 174, 215, 85, 55, 181, 230, 20, 28, 152, 181, 215, 5, 131, 132, 150, 130, 27, 152, 89, 155, 0, 169, 24, 176, 45, 250, 219, 169, 54, 203, 154, 230, 119, 93, 93, 255, 108, 108, 28, 212, 65, 63, 223, 205, 90, 14, 158, 149, 132, 36, 162, 140, 159, 21, 227, 167, 178, 70, 32, 190, 169, 119, 97, 241, 232, 225, 166, 232, 243, 208, 231, 195, 222, 131, 36, 218, 197, 178, 101, 93, 93, 174, 170, 68, 70, 159, 235, 111, 107, 204, 40, 118, 112, 253, 105, 57, 
            49, 107, 174, 32, 42, 90, 239, 11, 7, 9, 44, 18, 28, 56, 109, 223, 70, 54, 243, 198, 93, 7, 178, 237, 112, 84, 113, 244, 107, 101, 48, 187, 42, 243, 247, 162, 49, 194, 182, 137, 28, 145, 117, 144, 7, 160, 52, 23, 159, 188, 251, 14, 132, 141, 186, 37, 169, 222, 121, 60, 178, 239, 56, 115, 243, 121, 255, 106, 232, 72, 190, 65, 197, 27, 125, 88, 222, 42, 60, 240, 121, 79, 5, 233, 98, 126, 68, 194, 79, 45, 135, 219, 84, 28, 198, 148, 21, 138, 1, 141, 14, 187, 64, 166, 35, 232, 131, 191, 56, 217, 194, 56, 160, 197, 13, 33, 187, 244, 76, 10, 150, 167, 143, 19, 141, 150, 206, 92, 204, 0, 9, 69, 215, 49, 72, 110, 250, 98, 139, 119, 225, 83, 202, 
            186, 187, 93, 84, 163, 160, 108, 21, 136, 141, 63, 214, 145, 150, 14, 151, 222, 215, 152, 80, 199, 204, 169, 17, 236, 225, 250, 210, 245, 250, 203, 147, 114, 98, 215, 92, 107, 121, 230, 29, 64, 84, 181, 222, 89, 79, 132, 159, 22, 14, 18, 88, 15, 21, 35, 25, 36, 56, 112, 218, 61, 35, 65, 155, 101, 253, 107, 167, 124, 230, 90, 230, 87, 203, 9, 37, 78, 208, 56, 100, 1, 145, 174, 163, 24, 138, 159, 226, 51, 167, 204, 33, 42, 188, 253, 96, 173, 36, 225, 175, 180, 63, 208, 238, 159, 18, 131, 45, 134, 9, 178, 108, 201, 72, 36, 171, 208, 83, 21, 234, 251, 126, 70, 41, 226, 101, 119, 104, 47, 63, 121, 246, 54, 36, 72, 183, 29, 9, 27, 116, 4, 18, 
            42, 53, 75, 83, 188, 242, 82, 72, 141, 179, 121, 101, 222, 112, 96, 126, 239, 49, 231, 230, 243, 254, 254, 253, 194, 191, 213, 208, 145, 124, 204, 203, 160, 61, 131, 138, 54, 250, 154, 145, 7, 187, 177, 188, 84, 120, 168, 167, 101, 57, 59, 131, 152, 75, 34, 152, 169, 10, 9, 181, 250, 201, 16, 174, 203, 136, 95, 239, 93, 79, 70, 244, 108, 14, 109, 217, 63, 205, 116, 194, 14, 140, 243, 90, 18, 67, 234, 65, 35, 2, 193, 108, 112, 193, 216, 119, 65, 128, 151, 54, 215, 71, 142, 45, 230, 6, 165, 0, 181, 197, 188, 27, 132, 132, 113, 65, 138, 26, 104, 90, 187, 91, 67, 119, 232, 152, 90, 108, 217, 217, 21, 45, 79, 30, 12, 54, 126, 95, 39, 27, 
            45, 156, 62, 0, 28, 221, 185, 152, 0, 18, 160, 131, 49, 83, 139, 174, 98, 144, 146, 181, 83, 209, 221, 244, 197, 22, 196, 239, 244, 87, 239, 194, 167, 148, 246, 217, 150, 213, 174, 7, 188, 233, 183, 28, 141, 168, 156, 49, 222, 107, 133, 42, 239, 42, 202, 107, 121, 237, 211, 112, 72, 172, 248, 93, 27, 111, 225, 70, 42, 46, 102, 222, 54, 225, 127, 197, 7, 160, 84, 232, 84, 99, 77, 243, 101, 34, 2, 178, 243, 229, 27, 169, 194, 164, 48, 132, 145, 103, 41, 159, 160, 38, 228, 197, 174, 184, 253, 222, 159, 249, 214, 243, 204, 58, 207, 232, 253, 123, 128, 169, 107, 188, 153, 178, 90, 253, 178, 159, 9, 62, 171, 132, 56, 127, 44, 28, 36, 176, 
            53, 7, 21, 241, 30, 42, 70, 50, 7, 49, 119, 115, 72, 112, 225, 180, 81, 107, 208, 245, 122, 70, 131, 54, 99, 93, 178, 119, 203, 250, 215, 78, 210, 225, 230, 15, 249, 204, 181, 204, 224, 215, 132, 141, 175, 150, 18, 74, 182, 141, 35, 11, 157, 160, 112, 200, 132, 187, 65, 137, 3, 35, 93, 70, 26, 56, 108, 7, 49, 21, 63, 196, 40, 14, 14, 133, 103, 79, 152, 66, 126, 84, 169, 3, 85, 121, 250, 192, 76, 98, 203, 129, 129, 56, 197, 31, 152, 35, 244, 94, 179, 14, 167, 157, 170, 21, 150, 220, 229, 84, 0, 27, 252, 79, 49, 90, 215, 98, 98, 153, 206, 121, 83, 216, 73, 225, 79, 23, 80, 250, 126, 86, 123, 215, 45, 149, 98, 204, 28, 212, 45, 141, 138, 19, 
            52, 150, 187, 82, 31, 187, 232, 145, 6, 160, 217, 208, 94, 126, 243, 236, 71, 101, 194, 173, 108, 72, 145, 110, 117, 83, 160, 47, 58, 18, 54, 232, 35, 9, 7, 169, 8, 36, 84, 106, 17, 63, 101, 43, 150, 167, 121, 228, 143, 188, 72, 165, 164, 145, 27, 102, 189, 138, 42, 39, 242, 203, 188, 224, 235, 208, 141, 161, 192, 253, 222, 98, 217, 230, 239, 35, 20, 188, 225, 189, 13, 167, 208, 252, 38, 138, 131, 63, 63, 145, 178, 126, 112, 208, 36, 185, 105, 203, 21, 248, 66, 230, 70, 59, 91, 253, 119, 122, 220, 101, 107, 181, 197, 126, 90, 244, 238, 83, 9, 55, 247, 72, 56, 118, 184, 9, 174, 177, 161, 18, 159, 240, 138, 63, 204, 51, 147, 36, 253, 
            114, 0, 0, 0, 0, 1, 194, 106, 55, 3, 132, 212, 110, 2, 70, 190, 89, 7, 9, 168, 220, 6, 203, 194, 235, 4, 141, 124, 178, 5, 79, 22, 133, 14, 19, 81, 184, 15, 209, 59, 143, 13, 151, 133, 214, 12, 85, 239, 225, 9, 26, 249, 100, 8, 216, 147, 83, 10, 158, 45, 10, 11, 92, 71, 61, 28, 38, 163, 112, 29, 228, 201, 71, 31, 162, 119, 30, 30, 96, 29, 41, 27, 47, 11, 172, 26, 237, 97, 155, 24, 171, 223, 194, 25, 105, 181, 245, 18, 53, 242, 200, 19, 247, 152, 255, 17, 177, 38, 166, 16, 115, 76, 145, 21, 60, 90, 20, 20, 254, 48, 35, 22, 184, 142, 122, 23, 122, 228, 77, 56, 77, 70, 224, 57, 143, 44, 215, 59, 201, 146, 142, 58, 11, 248, 185, 63, 68, 238, 60, 
            62, 134, 132, 11, 60, 192, 58, 82, 61, 2, 80, 101, 54, 94, 23, 88, 55, 156, 125, 111, 53, 218, 195, 54, 52, 24, 169, 1, 49, 87, 191, 132, 48, 149, 213, 179, 50, 211, 107, 234, 51, 17, 1, 221, 36, 107, 229, 144, 37, 169, 143, 167, 39, 239, 49, 254, 38, 45, 91, 201, 35, 98, 77, 76, 34, 160, 39, 123, 32, 230, 153, 34, 33, 36, 243, 21, 42, 120, 180, 40, 43, 186, 222, 31, 41, 252, 96, 70, 40, 62, 10, 113, 45, 113, 28, 244, 44, 179, 118, 195, 46, 245, 200, 154, 47, 55, 162, 173, 112, 154, 141, 192, 113, 88, 231, 247, 115, 30, 89, 174, 114, 220, 51, 153, 119, 147, 37, 28, 118, 81, 79, 43, 116, 23, 241, 114, 117, 213, 155, 69, 126, 137, 220, 120, 
            127, 75, 182, 79, 125, 13, 8, 22, 124, 207, 98, 33, 121, 128, 116, 164, 120, 66, 30, 147, 122, 4, 160, 202, 123, 198, 202, 253, 108, 188, 46, 176, 109, 126, 68, 135, 111, 56, 250, 222, 110, 250, 144, 233, 107, 181, 134, 108, 106, 119, 236, 91, 104, 49, 82, 2, 105, 243, 56, 53, 98, 175, 127, 8, 99, 109, 21, 63, 97, 43, 171, 102, 96, 233, 193, 81, 101, 166, 215, 212, 100, 100, 189, 227, 102, 34, 3, 186, 103, 224, 105, 141, 72, 215, 203, 32, 73, 21, 161, 23, 75, 83, 31, 78, 74, 145, 117, 121, 79, 222, 99, 252, 78, 28, 9, 203, 76, 90, 183, 146, 77, 152, 221, 165, 70, 196, 154, 152, 71, 6, 240, 175, 69, 64, 78, 246, 68, 130, 36, 193, 65, 205, 
            50, 68, 64, 15, 88, 115, 66, 73, 230, 42, 67, 139, 140, 29, 84, 241, 104, 80, 85, 51, 2, 103, 87, 117, 188, 62, 86, 183, 214, 9, 83, 248, 192, 140, 82, 58, 170, 187, 80, 124, 20, 226, 81, 190, 126, 213, 90, 226, 57, 232, 91, 32, 83, 223, 89, 102, 237, 134, 88, 164, 135, 177, 93, 235, 145, 52, 92, 41, 251, 3, 94, 111, 69, 90, 95, 173, 47, 109, 225, 53, 27, 128, 224, 247, 113, 183, 226, 177, 207, 238, 227, 115, 165, 217, 230, 60, 179, 92, 231, 254, 217, 107, 229, 184, 103, 50, 228, 122, 13, 5, 239, 38, 74, 56, 238, 228, 32, 15, 236, 162, 158, 86, 237, 96, 244, 97, 232, 47, 226, 228, 233, 237, 136, 211, 235, 171, 54, 138, 234, 105, 92, 189, 
            253, 19, 184, 240, 252, 209, 210, 199, 254, 151, 108, 158, 255, 85, 6, 169, 250, 26, 16, 44, 251, 216, 122, 27, 249, 158, 196, 66, 248, 92, 174, 117, 243, 0, 233, 72, 242, 194, 131, 127, 240, 132, 61, 38, 241, 70, 87, 17, 244, 9, 65, 148, 245, 203, 43, 163, 247, 141, 149, 250, 246, 79, 255, 205, 217, 120, 93, 96, 216, 186, 55, 87, 218, 252, 137, 14, 219, 62, 227, 57, 222, 113, 245, 188, 223, 179, 159, 139, 221, 245, 33, 210, 220, 55, 75, 229, 215, 107, 12, 216, 214, 169, 102, 239, 212, 239, 216, 182, 213, 45, 178, 129, 208, 98, 164, 4, 209, 160, 206, 51, 211, 230, 112, 106, 210, 36, 26, 93, 197, 94, 254, 16, 196, 156, 148, 39, 198, 
            218, 42, 126, 199, 24, 64, 73, 194, 87, 86, 204, 195, 149, 60, 251, 193, 211, 130, 162, 192, 17, 232, 149, 203, 77, 175, 168, 202, 143, 197, 159, 200, 201, 123, 198, 201, 11, 17, 241, 204, 68, 7, 116, 205, 134, 109, 67, 207, 192, 211, 26, 206, 2, 185, 45, 145, 175, 150, 64, 144, 109, 252, 119, 146, 43, 66, 46, 147, 233, 40, 25, 150, 166, 62, 156, 151, 100, 84, 171, 149, 34, 234, 242, 148, 224, 128, 197, 159, 188, 199, 248, 158, 126, 173, 207, 156, 56, 19, 150, 157, 250, 121, 161, 152, 181, 111, 36, 153, 119, 5, 19, 155, 49, 187, 74, 154, 243, 209, 125, 141, 137, 53, 48, 140, 75, 95, 7, 142, 13, 225, 94, 143, 207, 139, 105, 138, 128, 
            157, 236, 139, 66, 247, 219, 137, 4, 73, 130, 136, 198, 35, 181, 131, 154, 100, 136, 130, 88, 14, 191, 128, 30, 176, 230, 129, 220, 218, 209, 132, 147, 204, 84, 133, 81, 166, 99, 135, 23, 24, 58, 134, 213, 114, 13, 169, 226, 208, 160, 168, 32, 186, 151, 170, 102, 4, 206, 171, 164, 110, 249, 174, 235, 120, 124, 175, 41, 18, 75, 173, 111, 172, 18, 172, 173, 198, 37, 167, 241, 129, 24, 166, 51, 235, 47, 164, 117, 85, 118, 165, 183, 63, 65, 160, 248, 41, 196, 161, 58, 67, 243, 163, 124, 253, 170, 162, 190, 151, 157, 181, 196, 115, 208, 180, 6, 25, 231, 182, 64, 167, 190, 183, 130, 205, 137, 178, 205, 219, 12, 179, 15, 177, 59, 177, 
            73, 15, 98, 176, 139, 101, 85, 187, 215, 34, 104, 186, 21, 72, 95, 184, 83, 246, 6, 185, 145, 156, 49, 188, 222, 138, 180, 189, 28, 224, 131, 191, 90, 94, 218, 190, 152, 52, 237, 0, 0, 0, 0, 184, 188, 103, 101, 170, 9, 200, 139, 18, 181, 175, 238, 143, 98, 151, 87, 55, 222, 240, 50, 37, 107, 95, 220, 157, 215, 56, 185, 197, 180, 40, 239, 125, 8, 79, 138, 111, 189, 224, 100, 215, 1, 135, 1, 74, 214, 191, 184, 242, 106, 216, 221, 224, 223, 119, 51, 88, 99, 16, 86, 80, 25, 87, 159, 232, 165, 48, 250, 250, 16, 159, 20, 66, 172, 248, 113, 223, 123, 192, 200, 103, 199, 167, 173, 117, 114, 8, 67, 205, 206, 111, 38, 149, 173, 127, 112, 45, 17, 
            24, 21, 63, 164, 183, 251, 135, 24, 208, 158, 26, 207, 232, 39, 162, 115, 143, 66, 176, 198, 32, 172, 8, 122, 71, 201, 160, 50, 175, 62, 24, 142, 200, 91, 10, 59, 103, 181, 178, 135, 0, 208, 47, 80, 56, 105, 151, 236, 95, 12, 133, 89, 240, 226, 61, 229, 151, 135, 101, 134, 135, 209, 221, 58, 224, 180, 207, 143, 79, 90, 119, 51, 40, 63, 234, 228, 16, 134, 82, 88, 119, 227, 64, 237, 216, 13, 248, 81, 191, 104, 240, 43, 248, 161, 72, 151, 159, 196, 90, 34, 48, 42, 226, 158, 87, 79, 127, 73, 111, 246, 199, 245, 8, 147, 213, 64, 167, 125, 109, 252, 192, 24, 53, 159, 208, 78, 141, 35, 183, 43, 159, 150, 24, 197, 39, 42, 127, 160, 186, 253, 
            71, 25, 2, 65, 32, 124, 16, 244, 143, 146, 168, 72, 232, 247, 155, 20, 88, 61, 35, 168, 63, 88, 49, 29, 144, 182, 137, 161, 247, 211, 20, 118, 207, 106, 172, 202, 168, 15, 190, 127, 7, 225, 6, 195, 96, 132, 94, 160, 112, 210, 230, 28, 23, 183, 244, 169, 184, 89, 76, 21, 223, 60, 209, 194, 231, 133, 105, 126, 128, 224, 123, 203, 47, 14, 195, 119, 72, 107, 203, 13, 15, 162, 115, 177, 104, 199, 97, 4, 199, 41, 217, 184, 160, 76, 68, 111, 152, 245, 252, 211, 255, 144, 238, 102, 80, 126, 86, 218, 55, 27, 14, 185, 39, 77, 182, 5, 64, 40, 164, 176, 239, 198, 28, 12, 136, 163, 129, 219, 176, 26, 57, 103, 215, 127, 43, 210, 120, 145, 147, 110, 
            31, 244, 59, 38, 247, 3, 131, 154, 144, 102, 145, 47, 63, 136, 41, 147, 88, 237, 180, 68, 96, 84, 12, 248, 7, 49, 30, 77, 168, 223, 166, 241, 207, 186, 254, 146, 223, 236, 70, 46, 184, 137, 84, 155, 23, 103, 236, 39, 112, 2, 113, 240, 72, 187, 201, 76, 47, 222, 219, 249, 128, 48, 99, 69, 231, 85, 107, 63, 160, 156, 211, 131, 199, 249, 193, 54, 104, 23, 121, 138, 15, 114, 228, 93, 55, 203, 92, 225, 80, 174, 78, 84, 255, 64, 246, 232, 152, 37, 174, 139, 136, 115, 22, 55, 239, 22, 4, 130, 64, 248, 188, 62, 39, 157, 33, 233, 31, 36, 153, 85, 120, 65, 139, 224, 215, 175, 51, 92, 176, 202, 237, 89, 182, 59, 85, 229, 209, 94, 71, 80, 126, 176, 
            255, 236, 25, 213, 98, 59, 33, 108, 218, 135, 70, 9, 200, 50, 233, 231, 112, 142, 142, 130, 40, 237, 158, 212, 144, 81, 249, 177, 130, 228, 86, 95, 58, 88, 49, 58, 167, 143, 9, 131, 31, 51, 110, 230, 13, 134, 193, 8, 181, 58, 166, 109, 189, 64, 225, 164, 5, 252, 134, 193, 23, 73, 41, 47, 175, 245, 78, 74, 50, 34, 118, 243, 138, 158, 17, 150, 152, 43, 190, 120, 32, 151, 217, 29, 120, 244, 201, 75, 192, 72, 174, 46, 210, 253, 1, 192, 106, 65, 102, 165, 247, 150, 94, 28, 79, 42, 57, 121, 93, 159, 150, 151, 229, 35, 241, 242, 77, 107, 25, 5, 245, 215, 126, 96, 231, 98, 209, 142, 95, 222, 182, 235, 194, 9, 142, 82, 122, 181, 233, 55, 104, 
            0, 70, 217, 208, 188, 33, 188, 136, 223, 49, 234, 48, 99, 86, 143, 34, 214, 249, 97, 154, 106, 158, 4, 7, 189, 166, 189, 191, 1, 193, 216, 173, 180, 110, 54, 21, 8, 9, 83, 29, 114, 78, 154, 165, 206, 41, 255, 183, 123, 134, 17, 15, 199, 225, 116, 146, 16, 217, 205, 42, 172, 190, 168, 56, 25, 17, 70, 128, 165, 118, 35, 216, 198, 102, 117, 96, 122, 1, 16, 114, 207, 174, 254, 202, 115, 201, 155, 87, 164, 241, 34, 239, 24, 150, 71, 253, 173, 57, 169, 69, 17, 94, 204, 118, 77, 238, 6, 206, 241, 137, 99, 220, 68, 38, 141, 100, 248, 65, 232, 249, 47, 121, 81, 65, 147, 30, 52, 83, 38, 177, 218, 235, 154, 214, 191, 179, 249, 198, 233, 11, 69, 
            161, 140, 25, 240, 14, 98, 161, 76, 105, 7, 60, 155, 81, 190, 132, 39, 54, 219, 150, 146, 153, 53, 46, 46, 254, 80, 38, 84, 185, 153, 158, 232, 222, 252, 140, 93, 113, 18, 52, 225, 22, 119, 169, 54, 46, 206, 17, 138, 73, 171, 3, 63, 230, 69, 187, 131, 129, 32, 227, 224, 145, 118, 91, 92, 246, 19, 73, 233, 89, 253, 241, 85, 62, 152, 108, 130, 6, 33, 212, 62, 97, 68, 198, 139, 206, 170, 126, 55, 169, 207, 214, 127, 65, 56, 110, 195, 38, 93, 124, 118, 137, 179, 196, 202, 238, 214, 89, 29, 214, 111, 225, 161, 177, 10, 243, 20, 30, 228, 75, 168, 121, 129, 19, 203, 105, 215, 171, 119, 14, 178, 185, 194, 161, 92, 1, 126, 198, 57, 156, 169, 
            254, 128, 36, 21, 153, 229, 54, 160, 54, 11, 142, 28, 81, 110, 134, 102, 22, 167, 62, 218, 113, 194, 44, 111, 222, 44, 148, 211, 185, 73, 9, 4, 129, 240, 177, 184, 230, 149, 163, 13, 73, 123, 27, 177, 46, 30, 67, 210, 62, 72, 251, 110, 89, 45, 233, 219, 246, 195, 81, 103, 145, 166, 204, 176, 169, 31, 116, 12, 206, 122, 102, 185, 97, 148, 222, 5, 6, 241, 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 116, 111, 111, 32, 102, 97, 114, 32, 98, 97, 99, 107, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 100, 105, 115, 116, 97, 110, 99, 101, 32, 99, 111, 100, 101, 0, 0, 0, 105, 110, 118, 97, 108, 105, 100, 32, 
            108, 105, 116, 101, 114, 97, 108, 47, 108, 101, 110, 103, 116, 104, 32, 99, 111, 100, 101, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", za, w.ab + 10240);
        var Ya = w.V(K(12, "i8", ya), 8);
        x(0 == Ya % 8);
        p._memset = Za;
        var $a = 0;
        function P(a) {
            return J[$a >> 2] = a
        }
        var Q = {ea: 1,da: 2,be: 3,$c: 4,Q: 5,$a: 6,xc: 7,xd: 8,D: 9,Kc: 10,ca: 11,le: 11,Kb: 12,Db: 13,Vc: 14,Jd: 15,Wa: 16,Xa: 17,me: 18,Ya: 19,Lb: 20,la: 21,u: 22,sd: 23,Jb: 24,Nd: 25,ie: 26,Wc: 27,Fd: 28,na: 29,Zd: 30,ld: 31,Sd: 32,Sc: 33,Wd: 34,Bd: 42,Yc: 43,Lc: 44,bd: 45,cd: 46,dd: 47,kd: 48,je: 49,vd: 50,ad: 51,Qc: 35,yd: 37,Cc: 52,Fc: 53,ne: 54,td: 55,Gc: 56,Hc: 57,Rc: 35,Ic: 59,Hd: 60,wd: 61,fe: 62,Gd: 63,Cd: 64,Dd: 65,Yd: 66,zd: 67,Ac: 68,ce: 69,Mc: 70,Td: 71,nd: 72,Tc: 73,Ec: 74,Od: 76,Dc: 77,Xd: 78,ed: 79,fd: 80,jd: 81,hd: 82,gd: 83,Id: 38,Za: 39,od: 36,Ca: 40,Da: 95,Rd: 96,Pc: 104,
            ud: 105,Bc: 97,Vd: 91,Ld: 88,Ed: 92,$d: 108,Oc: 111,yc: 98,Nc: 103,rd: 101,pd: 100,ge: 110,Xc: 112,Gb: 113,Hb: 115,Eb: 114,Fb: 89,md: 90,Ud: 93,ae: 94,zc: 99,qd: 102,Ib: 106,ma: 107,he: 109,ke: 87,Uc: 122,de: 116,Md: 95,Ad: 123,Zc: 84,Pd: 75,Jc: 125,Kd: 131,Qd: 130,ee: 86}, ab = {"0": "Success",1: "Not super-user",2: "No such file or directory",3: "No such process",4: "Interrupted system call",5: "I/O error",6: "No such device or address",7: "Arg list too long",8: "Exec format error",9: "Bad file number",10: "No children",11: "No more processes",
            12: "Not enough core",13: "Permission denied",14: "Bad address",15: "Block device required",16: "Mount device busy",17: "File exists",18: "Cross-device link",19: "No such device",20: "Not a directory",21: "Is a directory",22: "Invalid argument",23: "Too many open files in system",24: "Too many open files",25: "Not a typewriter",26: "Text file busy",27: "File too large",28: "No space left on device",29: "Illegal seek",30: "Read only file system",31: "Too many links",32: "Broken pipe",33: "Math arg out of domain of func",
            34: "Math result not representable",35: "File locking deadlock error",36: "File or path name too long",37: "No record locks available",38: "Function not implemented",39: "Directory not empty",40: "Too many symbolic links",42: "No message of desired type",43: "Identifier removed",44: "Channel number out of range",45: "Level 2 not synchronized",46: "Level 3 halted",47: "Level 3 reset",48: "Link number out of range",49: "Protocol driver not attached",50: "No CSI structure available",51: "Level 2 halted",52: "Invalid exchange",
            53: "Invalid request descriptor",54: "Exchange full",55: "No anode",56: "Invalid request code",57: "Invalid slot",59: "Bad font file fmt",60: "Device not a stream",61: "No data (for no delay io)",62: "Timer expired",63: "Out of streams resources",64: "Machine is not on the network",65: "Package not installed",66: "The object is remote",67: "The link has been severed",68: "Advertise error",69: "Srmount error",70: "Communication error on send",71: "Protocol error",72: "Multihop attempted",73: "Cross mount point (not really error)",
            74: "Trying to read unreadable message",75: "Value too large for defined data type",76: "Given log. name not unique",77: "f.d. invalid for this operation",78: "Remote address changed",79: "Can   access a needed shared lib",80: "Accessing a corrupted shared lib",81: ".lib section in a.out corrupted",82: "Attempting to link in too many libs",83: "Attempting to exec a shared library",84: "Illegal byte sequence",86: "Streams pipe error",87: "Too many users",88: "Socket operation on non-socket",89: "Destination address required",
            90: "Message too long",91: "Protocol wrong type for socket",92: "Protocol not available",93: "Unknown protocol",94: "Socket type not supported",95: "Not supported",96: "Protocol family not supported",97: "Address family not supported by protocol family",98: "Address already in use",99: "Address not available",100: "Network interface is not configured",101: "Network is unreachable",102: "Connection reset by network",103: "Connection aborted",104: "Connection reset by peer",105: "No buffer space available",106: "Socket is already connected",
            107: "Socket is not connected",108: "Can't send after socket shutdown",109: "Too many references",110: "Connection timed out",111: "Connection refused",112: "Host is down",113: "Host is unreachable",114: "Socket already connected",115: "Connection already in progress",116: "Stale file handle",122: "Quota exceeded",123: "No medium (in tape drive)",125: "Operation canceled",130: "Previous owner died",131: "State not recoverable"};
        function bb(a, b) {
            for (var c = 0, d = a.length - 1; 0 <= d; d--) {
                var e = a[d];
                "." === e ? a.splice(d, 1) : ".." === e ? (a.splice(d, 1), c++) : c && (a.splice(d, 1), c--)
            }
            if (b)
                for (; c--; c)
                    a.unshift("..");
            return a
        }
        function R(a) {
            var b = "/" === a.charAt(0), c = "/" === a.substr(-1), a = bb(a.split("/").filter(function(a) {
                return !!a
            }), !b).join("/");
            !a && !b && (a = ".");
            a && c && (a += "/");
            return (b ? "/" : "") + a
        }
        function cb(a) {
            if ("/" === a)
                return "/";
            var b = a.lastIndexOf("/");
            return -1 === b ? a : a.substr(b + 1)
        }
        function db() {
            for (var a = "", b = l, c = arguments.length - 1; -1 <= c && !b; c--) {
                var d = 0 <= c ? arguments[c] : "/";
                "string" !== typeof d && f(new TypeError("Arguments to path.resolve must be strings"));
                d && (a = d + "/" + a, b = "/" === d.charAt(0))
            }
            a = bb(a.split("/").filter(function(a) {
                return !!a
            }), !b).join("/");
            return (b ? "/" : "") + a || "."
        }
        var eb = [];
        function fb(a, b) {
            eb[a] = {input: [],T: [],ha: b};
            gb[a] = {k: hb}
        }
        var hb = {open: function(a) {
                var b = eb[a.g.ya];
                b || f(new S(Q.Ya));
                a.G = b;
                a.seekable = l
            },close: function(a) {
                a.G.T.length && a.G.ha.wa(a.G, 10)
            },F: function(a, b, c, d) {
                (!a.G || !a.G.ha.qb) && f(new S(Q.$a));
                for (var e = 0, g = 0; g < d; g++) {
                    var h;
                    try {
                        h = a.G.ha.qb(a.G)
                    } catch (C) {
                        f(new S(Q.Q))
                    }
                    h === i && 0 === e && f(new S(Q.ca));
                    if (h === k || h === i)
                        break;
                    e++;
                    b[c + g] = h
                }
                e && (a.g.timestamp = Date.now());
                return e
            },write: function(a, b, c, d) {
                (!a.G || !a.G.ha.wa) && f(new S(Q.$a));
                for (var e = 0; e < d; e++)
                    try {
                        a.G.ha.wa(a.G, b[c + e])
                    } catch (g) {
                        f(new S(Q.Q))
                    }
                d && (a.g.timestamp = 
                Date.now());
                return e
            }}, T = {I: k,P: function() {
                return T.createNode(k, "/", 16895, 0)
            },createNode: function(a, b, c, d) {
                (24576 === (c & 61440) || 4096 === (c & 61440)) && f(new S(Q.ea));
                T.I || (T.I = {dir: {g: {O: T.o.O,C: T.o.C,fa: T.o.fa,ga: T.o.ga,rename: T.o.rename,Cb: T.o.Cb,zb: T.o.zb,xb: T.o.xb,Ba: T.o.Ba},J: {S: T.k.S}},file: {g: {O: T.o.O,C: T.o.C},J: {S: T.k.S,F: T.k.F,write: T.k.write,cb: T.k.cb,tb: T.k.tb}},link: {g: {O: T.o.O,C: T.o.C,za: T.o.za},J: {}},gb: {g: {O: T.o.O,C: T.o.C},J: ib}});
                c = jb(a, b, c, d);
                16384 === (c.mode & 61440) ? (c.o = T.I.dir.g, c.k = 
                T.I.dir.J, c.e = {}) : 32768 === (c.mode & 61440) ? (c.o = T.I.file.g, c.k = T.I.file.J, c.p = 0, c.e = k) : 40960 === (c.mode & 61440) ? (c.o = T.I.link.g, c.k = T.I.link.J) : 8192 === (c.mode & 61440) && (c.o = T.I.gb.g, c.k = T.I.gb.J);
                c.timestamp = Date.now();
                a && (a.e[b] = c);
                return c
            },ac: function(a) {
                if (a.e && a.e.subarray) {
                    for (var b = [], c = 0; c < a.p; ++c)
                        b.push(a.e[c]);
                    return b
                }
                return a.e
            },Ie: function(a) {
                return a.e && a.e.subarray ? a.e.subarray(0, a.p) : new Uint8Array(a.e)
            },kb: function(a, b) {
                a.e && (a.e.subarray && b > a.e.length) && (a.e = T.ac(a), a.p = a.e.length);
                if (!a.e || 
                a.e.subarray) {
                    var c = a.e ? a.e.buffer.byteLength : 0;
                    c >= b || (b = Math.max(b, c * (1048576 > c ? 2 : 1.125) | 0), 0 != c && (b = Math.max(b, 256)), c = a.e, a.e = new Uint8Array(b), 0 < a.p && a.e.set(c.subarray(0, a.p), 0))
                } else {
                    !a.e && 0 < b && (a.e = []);
                    for (; a.e.length < b; )
                        a.e.push(0)
                }
            },sc: function(a, b) {
                if (a.p != b)
                    if (0 == b)
                        a.e = k, a.p = 0;
                    else {
                        if (!a.e || a.e.subarray) {
                            var c = a.e;
                            a.e = new Uint8Array(new ArrayBuffer(b));
                            a.e.set(c.subarray(0, Math.min(b, a.p)))
                        } else if (a.e || (a.e = []), a.e.length > b)
                            a.e.length = b;
                        else
                            for (; a.e.length < b; )
                                a.e.push(0);
                        a.p = b
                    }
            },o: {O: function(a) {
                    var b = 
                    {};
                    b.De = 8192 === (a.mode & 61440) ? a.id : 1;
                    b.Oe = a.id;
                    b.mode = a.mode;
                    b.Ve = 1;
                    b.uid = 0;
                    b.Me = 0;
                    b.ya = a.ya;
                    b.size = 16384 === (a.mode & 61440) ? 4096 : 32768 === (a.mode & 61440) ? a.p : 40960 === (a.mode & 61440) ? a.link.length : 0;
                    b.ye = new Date(a.timestamp);
                    b.Te = new Date(a.timestamp);
                    b.Ce = new Date(a.timestamp);
                    b.Sb = 4096;
                    b.ze = Math.ceil(b.size / b.Sb);
                    return b
                },C: function(a, b) {
                    b.mode !== i && (a.mode = b.mode);
                    b.timestamp !== i && (a.timestamp = b.timestamp);
                    b.size !== i && T.sc(a, b.size)
                },fa: function() {
                    f(kb[Q.da])
                },ga: function(a, b, c, d) {
                    return T.createNode(a, 
                    b, c, d)
                },rename: function(a, b, c) {
                    if (16384 === (a.mode & 61440)) {
                        var d;
                        try {
                            d = lb(b, c)
                        } catch (e) {
                        }
                        if (d)
                            for (var g in d.e)
                                f(new S(Q.Za))
                    }
                    delete a.parent.e[a.name];
                    a.name = c;
                    b.e[c] = a;
                    a.parent = b
                },Cb: function(a, b) {
                    delete a.e[b]
                },zb: function(a, b) {
                    var c = lb(a, b), d;
                    for (d in c.e)
                        f(new S(Q.Za));
                    delete a.e[b]
                },xb: function(a) {
                    var b = [".", ".."], c;
                    for (c in a.e)
                        a.e.hasOwnProperty(c) && b.push(c);
                    return b
                },Ba: function(a, b, c) {
                    a = T.createNode(a, b, 41471, 0);
                    a.link = c;
                    return a
                },za: function(a) {
                    40960 !== (a.mode & 61440) && f(new S(Q.u));
                    return a.link
                }},
            k: {F: function(a, b, c, d, e) {
                    var g = a.g.e;
                    if (e >= a.g.p)
                        return 0;
                    a = Math.min(a.g.p - e, d);
                    x(0 <= a);
                    if (8 < a && g.subarray)
                        b.set(g.subarray(e, e + a), c);
                    else
                        for (d = 0; d < a; d++)
                            b[c + d] = g[e + d];
                    return a
                },write: function(a, b, c, d, e, g) {
                    if (!d)
                        return 0;
                    a = a.g;
                    a.timestamp = Date.now();
                    if (b.subarray && (!a.e || a.e.subarray)) {
                        if (g)
                            return a.e = b.subarray(c, c + d), a.p = d;
                        if (0 === a.p && 0 === e)
                            return a.e = new Uint8Array(b.subarray(c, c + d)), a.p = d;
                        if (e + d <= a.p)
                            return a.e.set(b.subarray(c, c + d), e), d
                    }
                    T.kb(a, e + d);
                    if (a.e.subarray && b.subarray)
                        a.e.set(b.subarray(c, 
                        c + d), e);
                    else
                        for (g = 0; g < d; g++)
                            a.e[e + g] = b[c + g];
                    a.p = Math.max(a.p, e + d);
                    return d
                },S: function(a, b, c) {
                    1 === c ? b += a.position : 2 === c && 32768 === (a.g.mode & 61440) && (b += a.g.p);
                    0 > b && f(new S(Q.u));
                    a.Va = [];
                    return a.position = b
                },cb: function(a, b, c) {
                    T.kb(a.g, b + c);
                    a.g.p = Math.max(a.g.p, b + c)
                },tb: function(a, b, c, d, e, g, h) {
                    32768 !== (a.g.mode & 61440) && f(new S(Q.Ya));
                    c = a.g.e;
                    if (!(h & 2) && (c.buffer === b || c.buffer === b.buffer))
                        a = l, d = c.byteOffset;
                    else {
                        if (0 < e || e + d < a.g.p)
                            c = c.subarray ? c.subarray(e, e + d) : Array.prototype.slice.call(c, e, e + d);
                        a = 
                        j;
                        (d = Aa(d)) || f(new S(Q.Kb));
                        b.set(c, d)
                    }
                    return {$e: d,we: a}
                }}}, mb = K(1, "i32*", ya), nb = K(1, "i32*", ya), ob = K(1, "i32*", ya), qb = k, gb = [k], U = [], rb = 1, V = k, sb = j, tb = {}, S = k, kb = {};
        function ub(a) {
            a instanceof S || f(a + " : " + Ca());
            P(a.ib)
        }
        function X(a, b) {
            var a = db("/", a), b = b || {}, c = {nb: j,Qa: 0}, d;
            for (d in c)
                b[d] === i && (b[d] = c[d]);
            8 < b.Qa && f(new S(Q.Ca));
            var c = bb(a.split("/").filter(function(a) {
                return !!a
            }), l), e = qb, g = "/";
            for (d = 0; d < c.length; d++) {
                var h = d === c.length - 1;
                if (h && b.parent)
                    break;
                e = lb(e, c[d]);
                g = R(g + "/" + c[d]);
                if (e.ua && (!h || h && b.nb))
                    e = e.ua.root;
                if (!h || b.Ja)
                    for (h = 0; 40960 === (e.mode & 61440); ) {
                        e = X(g).g;
                        e.o.za || f(new S(Q.u));
                        var e = e.o.za(e), C = db;
                        var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/.exec(g).slice(1), g = r[0], r = 
                        r[1];
                        !g && !r ? g = "." : (r && (r = r.substr(0, r.length - 1)), g += r);
                        g = C(g, e);
                        e = X(g, {Qa: b.Qa}).g;
                        40 < h++ && f(new S(Q.Ca))
                    }
            }
            return {path: g,g: e}
        }
        function vb(a) {
            for (var b; ; ) {
                if (a === a.parent)
                    return a = a.P.mc, !b ? a : "/" !== a[a.length - 1] ? a + "/" + b : a + b;
                b = b ? a.name + "/" + b : a.name;
                a = a.parent
            }
        }
        function wb(a, b) {
            for (var c = 0, d = 0; d < b.length; d++)
                c = (c << 5) - c + b.charCodeAt(d) | 0;
            return (a + c >>> 0) % V.length
        }
        function xb(a) {
            var b = wb(a.parent.id, a.name);
            if (V[b] === a)
                V[b] = a.Y;
            else
                for (b = V[b]; b; ) {
                    if (b.Y === a) {
                        b.Y = a.Y;
                        break
                    }
                    b = b.Y
                }
        }
        function lb(a, b) {
            var c = yb(a, "x");
            c && f(new S(c));
            for (c = V[wb(a.id, b)]; c; c = c.Y) {
                var d = c.name;
                if (c.parent.id === a.id && d === b)
                    return c
            }
            return a.o.fa(a, b)
        }
        function jb(a, b, c, d) {
            zb || (zb = function(a, b, c, d) {
                a || (a = this);
                this.parent = a;
                this.P = a.P;
                this.ua = k;
                this.id = rb++;
                this.name = b;
                this.mode = c;
                this.o = {};
                this.k = {};
                this.ya = d
            }, zb.prototype = {}, Object.defineProperties(zb.prototype, {F: {get: function() {
                        return 365 === (this.mode & 365)
                    },set: function(a) {
                        a ? this.mode |= 365 : this.mode &= -366
                    }},write: {get: function() {
                        return 146 === (this.mode & 146)
                    },set: function(a) {
                        a ? this.mode |= 146 : this.mode &= -147
                    }},hc: {get: function() {
                        return 16384 === (this.mode & 61440)
                    }},gc: {get: function() {
                        return 8192 === 
                        (this.mode & 61440)
                    }}}));
            a = new zb(a, b, c, d);
            b = wb(a.parent.id, a.name);
            a.Y = V[b];
            return V[b] = a
        }
        var Ab = {r: 0,rs: 1052672,"r+": 2,w: 577,wx: 705,xw: 705,"w+": 578,"wx+": 706,"xw+": 706,a: 1089,ax: 1217,xa: 1217,"a+": 1090,"ax+": 1218,"xa+": 1218};
        function Bb(a) {
            var b = Ab[a];
            "undefined" === typeof b && f(Error("Unknown file open mode: " + a));
            return b
        }
        function yb(a, b) {
            return sb ? 0 : -1 !== b.indexOf("r") && !(a.mode & 292) || -1 !== b.indexOf("w") && !(a.mode & 146) || -1 !== b.indexOf("x") && !(a.mode & 73) ? Q.Db : 0
        }
        function Cb(a, b) {
            try {
                return lb(a, b), Q.Xa
            } catch (c) {
            }
            return yb(a, "wx")
        }
        function Db(a, b, c) {
            Eb || (Eb = m(), Eb.prototype = {}, Object.defineProperties(Eb.prototype, {object: {get: function() {
                        return this.g
                    },set: function(a) {
                        this.g = a
                    }},Qe: {get: function() {
                        return 1 !== (this.N & 2097155)
                    }},Re: {get: function() {
                        return 0 !== (this.N & 2097155)
                    }},Pe: {get: function() {
                        return this.N & 1024
                    }}}));
            var d = new Eb, e;
            for (e in a)
                d[e] = a[e];
            var a = d, g;
            a: {
                b = b || 0;
                for (c = c || 4096; b <= c; b++)
                    if (!U[b]) {
                        g = b;
                        break a
                    }
                f(new S(Q.Jb))
            }
            a.A = g;
            return U[g] = a
        }
        var ib = {open: function(a) {
                a.k = gb[a.g.ya].k;
                a.k.open && a.k.open(a)
            },S: function() {
                f(new S(Q.na))
            }};
        function Fb(a, b) {
            var c = "/" === b, d = !b, e;
            c && qb && f(new S(Q.Wa));
            !c && !d && (e = X(b, {nb: l}), b = e.path, e = e.g, e.ua && f(new S(Q.Wa)), 16384 !== (e.mode & 61440) && f(new S(Q.Lb)));
            var d = {type: a,Xe: {},mc: b,nc: []}, g = a.P(d);
            g.P = d;
            d.root = g;
            c ? qb = g : e && (e.ua = d, e.P && e.P.nc.push(d));
            return g
        }
        function Gb(a, b, c) {
            var d = X(a, {parent: j}).g, a = cb(a), e = Cb(d, a);
            e && f(new S(e));
            d.o.ga || f(new S(Q.ea));
            return d.o.ga(d, a, b, c)
        }
        function Hb(a, b) {
            b = (b !== i ? b : 438) & 4095;
            b |= 32768;
            return Gb(a, b, 0)
        }
        function Ib(a, b) {
            b = (b !== i ? b : 511) & 1023;
            b |= 16384;
            return Gb(a, b, 0)
        }
        function Jb(a, b, c) {
            "undefined" === typeof c && (c = b, b = 438);
            return Gb(a, b | 8192, c)
        }
        function Kb(a, b) {
            var c = X(b, {parent: j}).g, d = cb(b), e = Cb(c, d);
            e && f(new S(e));
            c.o.Ba || f(new S(Q.ea));
            return c.o.Ba(c, d, a)
        }
        function Lb(a, b) {
            var c;
            c = "string" === typeof a ? X(a, {Ja: j}).g : a;
            c.o.C || f(new S(Q.ea));
            c.o.C(c, {mode: b & 4095 | c.mode & -4096,timestamp: Date.now()})
        }
        function Mb(a, b, c) {
            "" === a && f(new S(Q.da));
            var b = "string" === typeof b ? Bb(b) : b, c = b & 64 ? ("undefined" === typeof c ? 438 : c) & 4095 | 32768 : 0, d;
            if ("object" === typeof a)
                d = a;
            else {
                a = R(a);
                try {
                    d = X(a, {Ja: !(b & 131072)}).g
                } catch (e) {
                }
            }
            b & 64 && (d ? b & 128 && f(new S(Q.Xa)) : d = Gb(a, c, 0));
            d || f(new S(Q.da));
            8192 === (d.mode & 61440) && (b &= -513);
            d ? 40960 === (d.mode & 61440) ? c = Q.Ca : 16384 === (d.mode & 61440) && (0 !== (b & 2097155) || b & 512) ? c = Q.la : (c = ["r", "w", "rw"][b & 2097155], b & 512 && (c += "w"), c = yb(d, c)) : c = Q.da;
            c && f(new S(c));
            if (b & 512) {
                c = d;
                c = "string" === typeof c ? 
                X(c, {Ja: j}).g : c;
                c.o.C || f(new S(Q.ea));
                16384 === (c.mode & 61440) && f(new S(Q.la));
                32768 !== (c.mode & 61440) && f(new S(Q.u));
                var g = yb(c, "w");
                g && f(new S(g));
                c.o.C(c, {size: 0,timestamp: Date.now()})
            }
            b &= -641;
            d = Db({g: d,path: vb(d),N: b,seekable: j,position: 0,k: d.k,Va: [],error: l}, i, i);
            d.k.open && d.k.open(d);
            p.logReadFiles && !(b & 1) && (Nb || (Nb = {}), a in Nb || (Nb[a] = 1, p.printErr("read file: " + a)));
            try {
                tb.onOpenFile && (c = 0, 1 !== (b & 2097155) && (c |= 1), 0 !== (b & 2097155) && (c |= 2), tb.onOpenFile(a, c))
            } catch (h) {
                console.log("FS.trackingDelegate['onOpenFile']('" + 
                a + "', flags) threw an exception: " + h.message)
            }
            return d
        }
        function Ob(a) {
            try {
                a.k.close && a.k.close(a)
            } catch (b) {
                f(b)
            }finally {
                U[a.A] = k
            }
        }
        function Pb(a, b, c, d) {
            var e = I;
            (0 > c || 0 > d) && f(new S(Q.u));
            1 === (a.N & 2097155) && f(new S(Q.D));
            16384 === (a.g.mode & 61440) && f(new S(Q.la));
            a.k.F || f(new S(Q.u));
            var g = j;
            "undefined" === typeof d ? (d = a.position, g = l) : a.seekable || f(new S(Q.na));
            b = a.k.F(a, e, b, c, d);
            g || (a.position += b);
            return b
        }
        function Qb(a, b, c, d, e, g) {
            (0 > d || 0 > e) && f(new S(Q.u));
            0 === (a.N & 2097155) && f(new S(Q.D));
            16384 === (a.g.mode & 61440) && f(new S(Q.la));
            a.k.write || f(new S(Q.u));
            a.N & 1024 && ((!a.seekable || !a.k.S) && f(new S(Q.na)), a.k.S(a, 0, 2));
            var h = j;
            "undefined" === typeof e ? (e = a.position, h = l) : a.seekable || f(new S(Q.na));
            b = a.k.write(a, b, c, d, e, g);
            h || (a.position += b);
            try {
                if (a.path && tb.onWriteToFile)
                    tb.onWriteToFile(a.path)
            } catch (C) {
                console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + C.message)
            }
            return b
        }
        function Rb() {
            S || (S = function(a) {
                this.ib = a;
                for (var b in Q)
                    if (Q[b] === a) {
                        this.code = b;
                        break
                    }
                this.message = ab[a]
            }, S.prototype = Error(), [Q.da].forEach(function(a) {
                kb[a] = new S(a);
                kb[a].stack = "<generic error, no stack>"
            }))
        }
        var Sb;
        function Tb(a, b) {
            var c = 0;
            a && (c |= 365);
            b && (c |= 146);
            return c
        }
        function Ub(a, b, c, d) {
            a = R(("string" === typeof a ? a : vb(a)) + "/" + b);
            return Hb(a, Tb(c, d))
        }
        function Vb(a, b, c, d, e, g) {
            a = b ? R(("string" === typeof a ? a : vb(a)) + "/" + b) : a;
            d = Tb(d, e);
            e = Hb(a, d);
            if (c) {
                if ("string" === typeof c) {
                    for (var a = Array(c.length), b = 0, h = c.length; b < h; ++b)
                        a[b] = c.charCodeAt(b);
                    c = a
                }
                Lb(e, d | 146);
                a = Mb(e, "w");
                Qb(a, c, 0, c.length, 0, g);
                Ob(a);
                Lb(e, d)
            }
            return e
        }
        function Y(a, b, c, d) {
            a = R(("string" === typeof a ? a : vb(a)) + "/" + b);
            b = Tb(!!c, !!d);
            Y.sb || (Y.sb = 64);
            var e;
            e = Y.sb++ << 8 | 0;
            gb[e] = {k: {open: function(a) {
                        a.seekable = l
                    },close: function() {
                        d && (d.buffer && d.buffer.length) && d(10)
                    },F: function(a, b, d, e) {
                        for (var v = 0, y = 0; y < e; y++) {
                            var z;
                            try {
                                z = c()
                            } catch (n) {
                                f(new S(Q.Q))
                            }
                            z === i && 0 === v && f(new S(Q.ca));
                            if (z === k || z === i)
                                break;
                            v++;
                            b[d + y] = z
                        }
                        v && (a.g.timestamp = Date.now());
                        return v
                    },write: function(a, b, c, e) {
                        for (var v = 0; v < e; v++)
                            try {
                                d(b[c + v])
                            } catch (y) {
                                f(new S(Q.Q))
                            }
                        e && (a.g.timestamp = Date.now());
                        return v
                    }}};
            return Jb(a, b, e)
        }
        function Wb(a) {
            if (a.gc || a.hc || a.link || a.e)
                return j;
            var b = j;
            "undefined" !== typeof XMLHttpRequest && f(Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread."));
            if (p.read)
                try {
                    a.e = Ta(p.read(a.url), j), a.p = a.e.length
                } catch (c) {
                    b = l
                }
            else
                f(Error("Cannot load without read() or XMLHttpRequest."));
            b || P(Q.Q);
            return b
        }
        var zb, Eb, Nb;
        function Xb() {
            f("TODO")
        }
        var Z = {P: function() {
                return jb(k, "/", 16895, 0)
            },Wb: function(a, b, c) {
                c && x(1 == b == (6 == c));
                a = {Zb: a,type: b,protocol: c,q: k,ia: {},Oa: [],Z: [],aa: Z.B};
                b = Z.va();
                c = jb(Z.root, b, 49152, 0);
                c.$ = a;
                b = Db({path: b,g: c,N: Bb("r+"),seekable: l,k: Z.k});
                a.J = b;
                return a
            },ob: function(a) {
                a = U[a];
                return !a || 49152 !== (a.g.mode & 49152) ? k : a.g.$
            },k: {wb: function(a) {
                    a = a.g.$;
                    return a.aa.wb(a)
                },rb: function(a, b, c) {
                    a = a.g.$;
                    return a.aa.rb(a, b, c)
                },F: function(a, b, c, d) {
                    a = a.g.$;
                    d = a.aa.pc(a, d);
                    if (!d)
                        return 0;
                    b.set(d.buffer, c);
                    return d.buffer.length
                },
                write: function(a, b, c, d) {
                    a = a.g.$;
                    return a.aa.tc(a, b, c, d)
                },close: function(a) {
                    a = a.g.$;
                    a.aa.close(a)
                }},va: function() {
                Z.va.hb || (Z.va.hb = 0);
                return "socket[" + Z.va.hb++ + "]"
            },B: {pa: function(a, b, c) {
                    var d;
                    "object" === typeof b && (d = b, c = b = k);
                    if (d)
                        d._socket ? (b = d._socket.remoteAddress, c = d._socket.remotePort) : ((c = /ws[s]?:\/\/([^:]+):(\d+)/.exec(d.url)) || f(Error("WebSocket URL must be in the format ws(s)://address:port")), b = c[1], c = parseInt(c[2], 10));
                    else
                        try {
                            var e = p.websocket && "object" === typeof p.websocket, g = "ws:#".replace("#", 
                            "//");
                            e && "string" === typeof p.websocket.url && (g = p.websocket.url);
                            if ("ws://" === g || "wss://" === g)
                                g = g + b + ":" + c;
                            var h = "binary";
                            e && "string" === typeof p.websocket.subprotocol && (h = p.websocket.subprotocol);
                            var h = h.replace(/^ +| +$/g, "").split(/ *, */), C = s ? {protocol: h.toString()} : h;
                            d = new (s ? require("ws") : window.WebSocket)(g, C);
                            d.binaryType = "arraybuffer"
                        } catch (r) {
                            f(new S(Q.Gb))
                        }
                    b = {K: b,port: c,n: d,qa: []};
                    Z.B.bb(a, b);
                    Z.B.ec(a, b);
                    2 === a.type && "undefined" !== typeof a.ba && b.qa.push(new Uint8Array([255, 255, 255, 255, 112, 
                        111, 114, 116, (a.ba & 65280) >> 8, a.ba & 255]));
                    return b
                },ta: function(a, b, c) {
                    return a.ia[b + ":" + c]
                },bb: function(a, b) {
                    a.ia[b.K + ":" + b.port] = b
                },yb: function(a, b) {
                    delete a.ia[b.K + ":" + b.port]
                },ec: function(a, b) {
                    function c() {
                        try {
                            for (var a = b.qa.shift(); a; )
                                b.n.send(a), a = b.qa.shift()
                        } catch (c) {
                            b.n.close()
                        }
                    }
                    function d(c) {
                        x("string" !== typeof c && c.byteLength !== i);
                        var c = new Uint8Array(c), d = e;
                        e = l;
                        d && 10 === c.length && 255 === c[0] && 255 === c[1] && 255 === c[2] && 255 === c[3] && 112 === c[4] && 111 === c[5] && 114 === c[6] && 116 === c[7] ? (c = c[8] << 8 | c[9], 
                        Z.B.yb(a, b), b.port = c, Z.B.bb(a, b)) : a.Z.push({K: b.K,port: b.port,data: c})
                    }
                    var e = j;
                    s ? (b.n.on("open", c), b.n.on("message", function(a, b) {
                        b.binary && d((new Uint8Array(a)).buffer)
                    }), b.n.on("error", m())) : (b.n.onopen = c, b.n.onmessage = function(a) {
                        d(a.data)
                    })
                },wb: function(a) {
                    if (1 === a.type && a.q)
                        return a.Oa.length ? 65 : 0;
                    var b = 0, c = 1 === a.type ? Z.B.ta(a, a.L, a.M) : k;
                    if (a.Z.length || !c || c && c.n.readyState === c.n.ka || c && c.n.readyState === c.n.CLOSED)
                        b |= 65;
                    if (!c || c && c.n.readyState === c.n.OPEN)
                        b |= 4;
                    if (c && c.n.readyState === c.n.ka || 
                    c && c.n.readyState === c.n.CLOSED)
                        b |= 16;
                    return b
                },rb: function(a, b, c) {
                    switch (b) {
                        case 21531:
                            return b = 0, a.Z.length && (b = a.Z[0].data.length), J[c >> 2] = b, 0;
                        default:
                            return Q.u
                    }
                },close: function(a) {
                    if (a.q) {
                        try {
                            a.q.close()
                        } catch (b) {
                        }
                        a.q = k
                    }
                    for (var c = Object.keys(a.ia), d = 0; d < c.length; d++) {
                        var e = a.ia[c[d]];
                        try {
                            e.n.close()
                        } catch (g) {
                        }
                        Z.B.yb(a, e)
                    }
                    return 0
                },bind: function(a, b, c) {
                    ("undefined" !== typeof a.Sa || "undefined" !== typeof a.ba) && f(new S(Q.u));
                    a.Sa = b;
                    a.ba = c || Xb();
                    if (2 === a.type) {
                        a.q && (a.q.close(), a.q = k);
                        try {
                            a.aa.lc(a, 
                            0)
                        } catch (d) {
                            d instanceof S || f(d), d.ib !== Q.Da && f(d)
                        }
                    }
                },Be: function(a, b, c) {
                    a.q && f(new S(ERRNO_CODS.Da));
                    if ("undefined" !== typeof a.L && "undefined" !== typeof a.M) {
                        var d = Z.B.ta(a, a.L, a.M);
                        d && (d.n.readyState === d.n.CONNECTING && f(new S(Q.Eb)), f(new S(Q.Ib)))
                    }
                    b = Z.B.pa(a, b, c);
                    a.L = b.K;
                    a.M = b.port;
                    f(new S(Q.Hb))
                },lc: function(a) {
                    s || f(new S(Q.Da));
                    a.q && f(new S(Q.u));
                    var b = require("ws").Server;
                    a.q = new b({host: a.Sa,port: a.ba});
                    a.q.on("connection", function(b) {
                        if (1 === a.type) {
                            var d = Z.Wb(a.Zb, a.type, a.protocol), b = Z.B.pa(d, 
                            b);
                            d.L = b.K;
                            d.M = b.port;
                            a.Oa.push(d)
                        } else
                            Z.B.pa(a, b)
                    });
                    a.q.on("closed", function() {
                        a.q = k
                    });
                    a.q.on("error", m())
                },accept: function(a) {
                    a.q || f(new S(Q.u));
                    var b = a.Oa.shift();
                    b.J.N = a.J.N;
                    return b
                },Le: function(a, b) {
                    var c, d;
                    b ? ((a.L === i || a.M === i) && f(new S(Q.ma)), c = a.L, d = a.M) : (c = a.Sa || 0, d = a.ba || 0);
                    return {K: c,port: d}
                },tc: function(a, b, c, d, e, g) {
                    if (2 === a.type) {
                        if (e === i || g === i)
                            e = a.L, g = a.M;
                        (e === i || g === i) && f(new S(Q.Fb))
                    } else
                        e = a.L, g = a.M;
                    var h = Z.B.ta(a, e, g);
                    1 === a.type && ((!h || h.n.readyState === h.n.ka || h.n.readyState === 
                    h.n.CLOSED) && f(new S(Q.ma)), h.n.readyState === h.n.CONNECTING && f(new S(Q.ca)));
                    b = b instanceof Array || b instanceof ArrayBuffer ? b.slice(c, c + d) : b.buffer.slice(b.byteOffset + c, b.byteOffset + c + d);
                    if (2 === a.type && (!h || h.n.readyState !== h.n.OPEN)) {
                        if (!h || h.n.readyState === h.n.ka || h.n.readyState === h.n.CLOSED)
                            h = Z.B.pa(a, e, g);
                        h.qa.push(b);
                        return d
                    }
                    try {
                        return h.n.send(b), d
                    } catch (C) {
                        f(new S(Q.u))
                    }
                },pc: function(a, b) {
                    1 === a.type && a.q && f(new S(Q.ma));
                    var c = a.Z.shift();
                    if (!c) {
                        if (1 === a.type) {
                            var d = Z.B.ta(a, a.L, a.M);
                            if (d) {
                                if (d.n.readyState === 
                                d.n.ka || d.n.readyState === d.n.CLOSED)
                                    return k;
                                f(new S(Q.ca))
                            }
                            f(new S(Q.ma))
                        }
                        f(new S(Q.ca))
                    }
                    var d = c.data.byteLength || c.data.length, e = c.data.byteOffset || 0, g = c.data.buffer || c.data, h = Math.min(b, d), C = {buffer: new Uint8Array(g, e, h),K: c.K,port: c.port};
                    1 === a.type && h < d && (c.data = new Uint8Array(g, e + h, d - h), a.Z.unshift(c));
                    return C
                }}};
        function Yb(a, b, c) {
            a = U[a];
            if (!a)
                return P(Q.D), -1;
            try {
                return Pb(a, b, c)
            } catch (d) {
                return ub(d), -1
            }
        }
        function Zb(a) {
            a = U[a];
            if (!a)
                return P(Q.D), -1;
            try {
                return Ob(a), 0
            } catch (b) {
                return ub(b), -1
            }
        }
        function $b(a) {
            if (U[a])
                return 0;
            P(Q.D);
            return -1
        }
        function ac(a) {
            a = U[a - 1];
            return !a ? -1 : a.A
        }
        p._strlen = bc;
        function cc(a, b, c) {
            c = J[c >> 2];
            a = A(a);
            try {
                return Mb(a, b, c).A
            } catch (d) {
                return ub(d), -1
            }
        }
        p._memcpy = dc;
        function ec(a) {
            ec.Ub || (G = G + 4095 & -4096, ec.Ub = j, x(w.ra), ec.Rb = w.ra, w.ra = function() {
                B("cannot dynamically allocate, sbrk now has control")
            });
            var b = G;
            0 != a && ec.Rb(a);
            return b
        }
        function fc(a, b, c) {
            a = U[a];
            if (!a)
                return P(Q.D), -1;
            try {
                return Qb(a, I, b, c)
            } catch (d) {
                return ub(d), -1
            }
        }
        p._llvm_bswap_i32 = gc;
        var hc = l, ic = l, jc = l, kc = l, lc = i, mc = i, nc = 0;
        function oc(a) {
            var b = Date.now();
            if (0 === nc)
                nc = b + 1E3 / 60;
            else
                for (; b + 2 >= nc; )
                    nc += 1E3 / 60;
            b = Math.max(nc - b, 0);
            setTimeout(a, b)
        }
        function pc(a) {
            return {jpg: "image/jpeg",jpeg: "image/jpeg",png: "image/png",bmp: "image/bmp",ogg: "audio/ogg",wav: "audio/wav",mp3: "audio/mpeg"}[a.substr(a.lastIndexOf(".") + 1)]
        }
        var qc = [];
        function rc() {
            var a = p.canvas;
            qc.forEach(function(b) {
                b(a.width, a.height)
            })
        }
        function sc(a, b, c) {
            b && c ? (a.wc = b, a.fc = c) : (b = a.wc, c = a.fc);
            var d = b, e = c;
            p.forcedAspectRatio && 0 < p.forcedAspectRatio && (d / e < p.forcedAspectRatio ? d = Math.round(e * p.forcedAspectRatio) : e = Math.round(d / p.forcedAspectRatio));
            if ((document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === 
            a.parentNode && "undefined" != typeof screen)
                var g = Math.min(screen.width / d, screen.height / e), d = Math.round(d * g), e = Math.round(e * g);
            mc ? (a.width != d && (a.width = d), a.height != e && (a.height = e), "undefined" != typeof a.style && (a.style.removeProperty("width"), a.style.removeProperty("height"))) : (a.width != b && (a.width = b), a.height != c && (a.height = c), "undefined" != typeof a.style && (d != b || e != c ? (a.style.setProperty("width", d + "px", "important"), a.style.setProperty("height", e + "px", "important")) : (a.style.removeProperty("width"), a.style.removeProperty("height"))))
        }
        var tc, uc, vc, wc, $a = w.Bb(4);
        J[$a >> 2] = 0;
        Rb();
        V = Array(4096);
        Fb(T, "/");
        Ib("/tmp");
        Ib("/dev");
        gb[259] = {k: {F: function() {
                    return 0
                },write: function() {
                    return 0
                }}};
        Jb("/dev/null", 259);
        fb(1280, {qb: function(a) {
                if (!a.input.length) {
                    var b = k;
                    if (s) {
                        if (b = process.stdin.read(), !b) {
                            if (process.stdin._readableState && process.stdin._readableState.ended)
                                return k;
                            return
                        }
                    } else
                        "undefined" != typeof window && "function" == typeof window.prompt ? (b = window.prompt("Input: "), b !== k && (b += "\n")) : "function" == typeof readline && (b = readline(), b !== k && (b += "\n"));
                    if (!b)
                        return k;
                    a.input = Ta(b, j)
                }
                return a.input.shift()
            },wa: function(a, b) {
                b === k || 10 === b ? (p.print(a.T.join("")), a.T = []) : a.T.push(xc.Pa(b))
            }});
        fb(1536, {wa: function(a, b) {
                b === k || 10 === b ? (p.printErr(a.T.join("")), a.T = []) : a.T.push(xc.Pa(b))
            }});
        Jb("/dev/tty", 1280);
        Jb("/dev/tty1", 1536);
        var yc;
        if ("undefined" !== typeof crypto) {
            var zc = new Uint8Array(1);
            yc = function() {
                crypto.getRandomValues(zc);
                return zc[0]
            }
        } else
            yc = s ? function() {
                return require("crypto").randomBytes(1)[0]
            } : function() {
                return Math.floor(256 * Math.random())
            };
        Y("/dev", "random", yc);
        Y("/dev", "urandom", yc);
        Ib("/dev/shm");
        Ib("/dev/shm/tmp");
        Ma.unshift({X: function() {
                if (!p.noFSInit && !Sb) {
                    x(!Sb, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)");
                    Sb = j;
                    Rb();
                    p.stdin = p.stdin;
                    p.stdout = p.stdout;
                    p.stderr = p.stderr;
                    p.stdin ? Y("/dev", "stdin", p.stdin) : Kb("/dev/tty", "/dev/stdin");
                    p.stdout ? Y("/dev", "stdout", k, p.stdout) : Kb("/dev/tty", "/dev/stdout");
                    p.stderr ? Y("/dev", "stderr", k, p.stderr) : Kb("/dev/tty1", "/dev/stderr");
                    var a = Mb("/dev/stdin", 
                    "r");
                    J[mb >> 2] = a ? a.A + 1 : 0;
                    x(0 === a.A, "invalid handle for stdin (" + a.A + ")");
                    a = Mb("/dev/stdout", "w");
                    J[nb >> 2] = a ? a.A + 1 : 0;
                    x(1 === a.A, "invalid handle for stdout (" + a.A + ")");
                    a = Mb("/dev/stderr", "w");
                    J[ob >> 2] = a ? a.A + 1 : 0;
                    x(2 === a.A, "invalid handle for stderr (" + a.A + ")")
                }
            }});
        Na.push({X: function() {
                sb = l
            }});
        Oa.push({X: function() {
                Sb = l;
                for (var a = 0; a < U.length; a++) {
                    var b = U[a];
                    b && Ob(b)
                }
            }});
        p.FS_createFolder = function(a, b, c, d) {
            a = R(("string" === typeof a ? a : vb(a)) + "/" + b);
            return Ib(a, Tb(c, d))
        };
        p.FS_createPath = function(a, b) {
            for (var a = "string" === typeof a ? a : vb(a), c = b.split("/").reverse(); c.length; ) {
                var d = c.pop();
                if (d) {
                    var e = R(a + "/" + d);
                    try {
                        Ib(e)
                    } catch (g) {
                    }
                    a = e
                }
            }
            return e
        };
        p.FS_createDataFile = Vb;
        p.FS_createPreloadedFile = function(a, b, c, d, e, g, h, C, r) {
            function v() {
                jc = document.pointerLockElement === n || document.mozPointerLockElement === n || document.webkitPointerLockElement === n || document.msPointerLockElement === n
            }
            function y(c) {
                function n(c) {
                    C || Vb(a, b, c, d, e, r);
                    g && g();
                    Xa()
                }
                var y = l;
                p.preloadPlugins.forEach(function(a) {
                    !y && a.canHandle(t) && (a.handle(c, t, n, function() {
                        h && h();
                        Xa()
                    }), y = j)
                });
                y || n(c)
            }
            p.preloadPlugins || (p.preloadPlugins = []);
            if (!tc) {
                tc = j;
                try {
                    new Blob, uc = j
                } catch (z) {
                    uc = l, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                }
                vc = 
                "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : !uc ? console.log("warning: no BlobBuilder") : k;
                wc = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : i;
                !p.vb && "undefined" === typeof wc && (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), p.vb = j);
                p.preloadPlugins.push({canHandle: function(a) {
                        return !p.vb && /\.(jpg|jpeg|png|bmp)$/i.test(a)
                    },handle: function(a, b, 
                    c, d) {
                        var e = k;
                        if (uc)
                            try {
                                e = new Blob([a], {type: pc(b)}), e.size !== a.length && (e = new Blob([(new Uint8Array(a)).buffer], {type: pc(b)}))
                            } catch (g) {
                                w.ja("Blob constructor present but fails: " + g + "; falling back to blob builder")
                            }
                        e || (e = new vc, e.append((new Uint8Array(a)).buffer), e = e.getBlob());
                        var h = wc.createObjectURL(e), n = new Image;
                        n.onload = function() {
                            x(n.complete, "Image " + b + " could not be decoded");
                            var d = document.createElement("canvas");
                            d.width = n.width;
                            d.height = n.height;
                            d.getContext("2d").drawImage(n, 0, 0);
                            p.preloadedImages[b] = 
                            d;
                            wc.revokeObjectURL(h);
                            c && c(a)
                        };
                        n.onerror = function() {
                            console.log("Image " + h + " could not be decoded");
                            d && d()
                        };
                        n.src = h
                    }});
                p.preloadPlugins.push({canHandle: function(a) {
                        return !p.We && a.substr(-4) in {".ogg": 1,".wav": 1,".mp3": 1}
                    },handle: function(a, b, c, d) {
                        function e(d) {
                            h || (h = j, p.preloadedAudios[b] = d, c && c(a))
                        }
                        function g() {
                            h || (h = j, p.preloadedAudios[b] = new Audio, d && d())
                        }
                        var h = l;
                        if (uc) {
                            try {
                                var n = new Blob([a], {type: pc(b)})
                            } catch (y) {
                                return g()
                            }
                            var n = wc.createObjectURL(n), t = new Audio;
                            t.addEventListener("canplaythrough", 
                            function() {
                                e(t)
                            }, l);
                            t.onerror = function() {
                                if (!h) {
                                    console.log("warning: browser could not fully decode audio " + b + ", trying slower base64 approach");
                                    for (var c = "", d = 0, g = 0, n = 0; n < a.length; n++) {
                                        d = d << 8 | a[n];
                                        for (g += 8; 6 <= g; )
                                            var y = d >> g - 6 & 63, g = g - 6, c = c + "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[y]
                                    }
                                    2 == g ? (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d & 3) << 4], c += "==") : 4 == g && (c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(d & 15) << 2], c += "=");
                                    t.src = "data:audio/x-" + b.substr(-3) + ";base64," + c;
                                    e(t)
                                }
                            };
                            t.src = n;
                            p.noExitRuntime = j;
                            setTimeout(function() {
                                ia || e(t)
                            }, 1E4)
                        } else
                            return g()
                    }});
                var n = p.canvas;
                n && (n.Ra = n.requestPointerLock || n.mozRequestPointerLock || n.webkitRequestPointerLock || n.msRequestPointerLock || m(), n.jb = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || m(), n.jb = n.jb.bind(document), document.addEventListener("pointerlockchange", v, l), document.addEventListener("mozpointerlockchange", 
                v, l), document.addEventListener("webkitpointerlockchange", v, l), document.addEventListener("mspointerlockchange", v, l), p.elementPointerLock && n.addEventListener("click", function(a) {
                    !jc && n.Ra && (n.Ra(), a.preventDefault())
                }, l))
            }
            var t = b ? db(R(a + "/" + b)) : a;
            Wa();
            if ("string" == typeof c) {
                var E = h, W = function() {
                    E ? E() : f('Loading data file "' + c + '" failed.')
                }, F = new XMLHttpRequest;
                F.open("GET", c, j);
                F.responseType = "arraybuffer";
                F.onload = function() {
                    if (200 == F.status || 0 == F.status && F.response) {
                        var a = F.response;
                        x(a, 'Loading data file "' + 
                        c + '" failed (no arrayBuffer).');
                        a = new Uint8Array(a);
                        y(a);
                        Xa()
                    } else
                        W()
                };
                F.onerror = W;
                F.send(k);
                Wa()
            } else
                y(c)
        };
        p.FS_createLazyFile = function(a, b, c, d, e) {
            var g, h;
            function C() {
                this.Na = l;
                this.oa = []
            }
            C.prototype.get = function(a) {
                if (!(a > this.length - 1 || 0 > a)) {
                    var b = a % this.Vb;
                    return this.dc(Math.floor(a / this.Vb))[b]
                }
            };
            C.prototype.uc = function(a) {
                this.dc = a
            };
            C.prototype.eb = function() {
                var a = new XMLHttpRequest;
                a.open("HEAD", c, l);
                a.send(k);
                200 <= a.status && 300 > a.status || 304 === a.status || f(Error("Couldn't load " + c + ". Status: " + a.status));
                var b = Number(a.getResponseHeader("Content-length")), d, e = 1048576;
                if (!((d = a.getResponseHeader("Accept-Ranges")) && 
                "bytes" === d))
                    e = b;
                var g = this;
                g.uc(function(a) {
                    var d = a * e, h = (a + 1) * e - 1, h = Math.min(h, b - 1);
                    if ("undefined" === typeof g.oa[a]) {
                        var n = g.oa;
                        d > h && f(Error("invalid range (" + d + ", " + h + ") or no bytes requested!"));
                        h > b - 1 && f(Error("only " + b + " bytes available! programmer error!"));
                        var r = new XMLHttpRequest;
                        r.open("GET", c, l);
                        b !== e && r.setRequestHeader("Range", "bytes=" + d + "-" + h);
                        "undefined" != typeof Uint8Array && (r.responseType = "arraybuffer");
                        r.overrideMimeType && r.overrideMimeType("text/plain; charset=x-user-defined");
                        r.send(k);
                        200 <= r.status && 300 > r.status || 304 === r.status || f(Error("Couldn't load " + c + ". Status: " + r.status));
                        d = r.response !== i ? new Uint8Array(r.response || []) : Ta(r.responseText || "", j);
                        n[a] = d
                    }
                    "undefined" === typeof g.oa[a] && f(Error("doXHR failed!"));
                    return g.oa[a]
                });
                this.Pb = b;
                this.Ob = e;
                this.Na = j
            };
            "undefined" !== typeof XMLHttpRequest ? (ca || f("Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc"), g = new C, Object.defineProperty(g, "length", {get: function() {
                    this.Na || 
                    this.eb();
                    return this.Pb
                }}), Object.defineProperty(g, "chunkSize", {get: function() {
                    this.Na || this.eb();
                    return this.Ob
                }}), h = i) : (h = c, g = i);
            var r = Ub(a, b, d, e);
            g ? r.e = g : h && (r.e = k, r.url = h);
            Object.defineProperty(r, "usedBytes", {get: function() {
                    return this.e.length
                }});
            var v = {};
            Object.keys(r.k).forEach(function(a) {
                var b = r.k[a];
                v[a] = function() {
                    Wb(r) || f(new S(Q.Q));
                    return b.apply(k, arguments)
                }
            });
            v.F = function(a, b, c, d, e) {
                Wb(r) || f(new S(Q.Q));
                a = a.g.e;
                if (e >= a.length)
                    return 0;
                d = Math.min(a.length - e, d);
                x(0 <= d);
                if (a.slice)
                    for (var g = 
                    0; g < d; g++)
                        b[c + g] = a[e + g];
                else
                    for (g = 0; g < d; g++)
                        b[c + g] = a.get(e + g);
                return d
            };
            r.k = v;
            return r
        };
        p.FS_createLink = function(a, b, c) {
            a = R(("string" === typeof a ? a : vb(a)) + "/" + b);
            return Kb(c, a)
        };
        p.FS_createDevice = Y;
        Ma.unshift({X: m()});
        Oa.push({X: m()});
        var xc = new w.Ea;
        s && (require("fs"), process.platform.match(/^win/));
        Ma.push({X: function() {
                Z.root = Fb(Z, k)
            }});
        p.requestFullScreen = function(a, b) {
            function c() {
                ic = l;
                var a = d.parentNode;
                (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === a ? (d.fb = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen || document.exitFullscreen || 
                m(), d.fb = d.fb.bind(document), lc && d.Ra(), ic = j, mc && ("undefined" != typeof SDL && (a = Ea[SDL.screen + 0 * w.R >> 2], J[SDL.screen + 0 * w.R >> 2] = a | 8388608), rc())) : (a.parentNode.insertBefore(d, a), a.parentNode.removeChild(a), mc && ("undefined" != typeof SDL && (a = Ea[SDL.screen + 0 * w.R >> 2], J[SDL.screen + 0 * w.R >> 2] = a & -8388609), rc()));
                if (p.onFullScreen)
                    p.onFullScreen(ic);
                sc(d)
            }
            lc = a;
            mc = b;
            "undefined" === typeof lc && (lc = j);
            "undefined" === typeof mc && (mc = l);
            var d = p.canvas;
            kc || (kc = j, document.addEventListener("fullscreenchange", c, l), document.addEventListener("mozfullscreenchange", 
            c, l), document.addEventListener("webkitfullscreenchange", c, l), document.addEventListener("MSFullscreenChange", c, l));
            var e = document.createElement("div");
            d.parentNode.insertBefore(e, d);
            e.appendChild(d);
            e.rc = e.requestFullScreen || e.mozRequestFullScreen || e.msRequestFullscreen || (e.webkitRequestFullScreen ? function() {
                e.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
            } : k);
            e.rc()
        };
        p.requestAnimationFrame = function(a) {
            "undefined" === typeof window ? oc(a) : (window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || oc), window.requestAnimationFrame(a))
        };
        p.setCanvasSize = function(a, b, c) {
            sc(p.canvas, a, b);
            c || rc()
        };
        p.pauseMainLoop = m();
        p.resumeMainLoop = function() {
            hc && (hc = l, k())
        };
        p.getUserMedia = function() {
            window.pb || (window.pb = navigator.getUserMedia || navigator.mozGetUserMedia);
            window.pb(i)
        };
        Ga = u = w.V(D);
        Ha = Ga + 5242880;
        Ia = G = w.V(Ha);
        x(Ia < H, "TOTAL_MEMORY not big enough for stack");
        ta = Math.min;
        var $ = (function(global, env, buffer) {
            // EMSCRIPTEN_START_ASM
            "use asm";
            var a = new global.Int8Array(buffer);
            var b = new global.Int16Array(buffer);
            var c = new global.Int32Array(buffer);
            var d = new global.Uint8Array(buffer);
            var e = new global.Uint16Array(buffer);
            var f = new global.Uint32Array(buffer);
            var g = new global.Float32Array(buffer);
            var h = new global.Float64Array(buffer);
            var i = env.STACKTOP | 0;
            var j = env.STACK_MAX | 0;
            var k = env.tempDoublePtr | 0;
            var l = env.ABORT | 0;
            var m = 0;
            var n = 0;
            var o = 0;
            var p = 0;
            var q = +env.NaN, r = +env.Infinity;
            var s = 0, t = 0, u = 0, v = 0, w = 0.0, x = 0, y = 0, z = 0, A = 0.0;
            var B = 0;
            var C = 0;
            var D = 0;
            var E = 0;
            var F = 0;
            var G = 0;
            var H = 0;
            var I = 0;
            var J = 0;
            var K = 0;
            var L = global.Math.floor;
            var M = global.Math.abs;
            var N = global.Math.sqrt;
            var O = global.Math.pow;
            var P = global.Math.cos;
            var Q = global.Math.sin;
            var R = global.Math.tan;
            var S = global.Math.acos;
            var T = global.Math.asin;
            var U = global.Math.atan;
            var V = global.Math.atan2;
            var W = global.Math.exp;
            var X = global.Math.log;
            var Y = global.Math.ceil;
            var Z = global.Math.imul;
            var _ = env.abort;
            var $ = env.assert;
            var aa = env.asmPrintInt;
            var ba = env.asmPrintFloat;
            var ca = env.min;
            var da = env.invoke_iiii;
            var ea = env.invoke_vii;
            var fa = env.invoke_iii;
            var ga = env._send;
            var ha = env._fread;
            var ia = env.___setErrNo;
            var ja = env.___assert_fail;
            var ka = env._write;
            var la = env._fflush;
            var ma = env._pwrite;
            var na = env._open;
            var oa = env._sbrk;
            var pa = env._emscripten_memcpy_big;
            var qa = env._fileno;
            var ra = env._sysconf;
            var sa = env._close;
            var ta = env._ferror;
            var ua = env._pread;
            var va = env._mkport;
            var wa = env._fclose;
            var xa = env._feof;
            var ya = env._fsync;
            var za = env.___errno_location;
            var Aa = env._recv;
            var Ba = env._read;
            var Ca = env._abort;
            var Da = env._fwrite;
            var Ea = env._time;
            var Fa = env._fopen;
            var Ga = 0.0;
            // EMSCRIPTEN_START_FUNCS
            function Ka(a) {
                a = a | 0;
                var b = 0;
                b = i;
                i = i + a | 0;
                i = i + 7 & -8;
                return b | 0
            }
            function La() {
                return i | 0
            }
            function Ma(a) {
                a = a | 0;
                i = a
            }
            function Na(a, b) {
                a = a | 0;
                b = b | 0;
                if ((m | 0) == 0) {
                    m = a;
                    n = b
                }
            }
            function Oa(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0]
            }
            function Pa(b) {
                b = b | 0;
                a[k >> 0] = a[b >> 0];
                a[k + 1 >> 0] = a[b + 1 >> 0];
                a[k + 2 >> 0] = a[b + 2 >> 0];
                a[k + 3 >> 0] = a[b + 3 >> 0];
                a[k + 4 >> 0] = a[b + 4 >> 0];
                a[k + 5 >> 0] = a[b + 5 >> 0];
                a[k + 6 >> 0] = a[b + 6 >> 0];
                a[k + 7 >> 0] = a[b + 7 >> 0]
            }
            function Qa(a) {
                a = a | 0;
                B = a
            }
            function Ra() {
                return B | 0
            }
            function Sa(a, b, d) {
                a = a | 0;
                b = b | 0;
                d = d | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0;
                j = i;
                i = i + 64 | 0;
                k = j;
                l = sb(d) | 0;
                f = sb(d) | 0;
                g = Fa(120, 128) | 0;
                h = Fa(136, 144) | 0;
                c[k + 32 >> 2] = 0;
                c[k + 36 >> 2] = 0;
                c[k + 40 >> 2] = 0;
                a = Ua(k, a, 8, b * 15 | 0, 9, 0, 8, 56) | 0;
                do {
                    if ((a | 0) == 0) {
                        b = k + 4 | 0;
                        m = k + 16 | 0;
                        n = k + 12 | 0;
                        a: while (1) {
                            c[b >> 2] = ha(l | 0, 1, d | 0, g | 0) | 0;
                            if ((ta(g | 0) | 0) != 0) {
                                d = 4;
                                break
                            }
                            o = (xa(g | 0) | 0) != 0;
                            p = o ? 4 : 0;
                            c[k >> 2] = l;
                            do {
                                c[m >> 2] = d;
                                c[n >> 2] = f;
                                a = Xa(k, p) | 0;
                                if ((a | 0) == -2) {
                                    d = 7;
                                    break a
                                }
                                q = d - (c[m >> 2] | 0) | 0;
                                if ((Da(f | 0, 1, q | 0, h | 0) | 0) != (q | 0)) {
                                    d = 10;
                                    break a
                                }
                                if ((ta(h | 0) | 0) != 0) {
                                    d = 10;
                                    break a
                                }
                            } while ((c[m >> 2] | 0) == 0);
                            if ((c[b >> 2] | 0) != 0) {
                                d = 13;
                                break
                            }
                            if (o) {
                                d = 15;
                                break
                            }
                        }
                        if ((d | 0) == 4) {
                            Va(k) | 0;
                            e = -1;
                            break
                        } else if ((d | 0) == 7) {
                            ja(16, 40, 59, 56)
                        } else if ((d | 0) == 10) {
                            Va(k) | 0;
                            e = -1;
                            break
                        } else if ((d | 0) == 13) {
                            ja(64, 40, 66, 56)
                        } else if ((d | 0) == 15) {
                            if ((a | 0) == 1) {
                                Va(k) | 0;
                                e = 0;
                                break
                            } else {
                                ja(88, 40, 70, 56)
                            }
                        }
                    } else {
                        e = a
                    }
                } while (0);
                tb(l);
                tb(f);
                wa(g | 0) | 0;
                wa(h | 0) | 0;
                i = j;
                return e | 0
            }
            function Ta(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0;
                g = i;
                i = i + 64 | 0;
                n = g;
                d = sb(b) | 0;
                h = sb(b) | 0;
                e = Fa(120, 128) | 0;
                f = Fa(136, 144) | 0;
                r = n + 32 | 0;
                c[r >> 2] = 0;
                k = n + 36 | 0;
                c[k >> 2] = 0;
                j = n + 40 | 0;
                c[j >> 2] = 0;
                p = n + 4 | 0;
                c[p >> 2] = 0;
                c[n >> 2] = 0;
                v = a * 15 | 0;
                t = n + 24 | 0;
                c[t >> 2] = 0;
                c[r >> 2] = 1;
                c[j >> 2] = 0;
                c[k >> 2] = 1;
                r = ob(0, 1, 7116) | 0;
                a: do {
                    if ((r | 0) == 0) {
                        l = -4
                    } else {
                        s = n + 28 | 0;
                        c[s >> 2] = r;
                        c[r + 52 >> 2] = 0;
                        u = c[s >> 2] | 0;
                        do {
                            if ((u | 0) != 0) {
                                if ((a | 0) < 0) {
                                    a = 0 - v | 0;
                                    v = 0
                                } else {
                                    if ((v | 0) >= 48) {
                                        break
                                    }
                                    a = v & 15;
                                    v = (v >> 4) + 1 | 0
                                }
                                if ((a | 0) != 0) {
                                    if ((a | 0) < 8) {
                                        break
                                    }
                                    if ((a | 0) > 15) {
                                        break
                                    }
                                }
                                y = u + 52 | 0;
                                w = c[y >> 2] | 0;
                                x = u + 36 | 0;
                                if ((w | 0) != 0 ? (c[x >> 2] | 0) != (a | 0) : 0) {
                                    Ia[c[k >> 2] & 1](c[j >> 2] | 0, w);
                                    c[y >> 2] = 0
                                }
                                c[u + 8 >> 2] = v;
                                c[x >> 2] = a;
                                u = c[s >> 2] | 0;
                                if ((u | 0) != 0 ? (c[u + 40 >> 2] = 0, c[u + 44 >> 2] = 0, c[u + 48 >> 2] = 0, q = c[s >> 2] | 0, (q | 0) != 0) : 0) {
                                    c[q + 28 >> 2] = 0;
                                    c[n + 20 >> 2] = 0;
                                    c[n + 8 >> 2] = 0;
                                    c[t >> 2] = 0;
                                    r = c[q + 8 >> 2] | 0;
                                    if ((r | 0) != 0) {
                                        c[n + 48 >> 2] = r & 1
                                    }
                                    c[q >> 2] = 0;
                                    c[q + 4 >> 2] = 0;
                                    c[q + 12 >> 2] = 0;
                                    c[q + 20 >> 2] = 32768;
                                    c[q + 32 >> 2] = 0;
                                    c[q + 56 >> 2] = 0;
                                    c[q + 60 >> 2] = 0;
                                    r = q + 1328 | 0;
                                    c[q + 108 >> 2] = r;
                                    c[q + 80 >> 2] = r;
                                    c[q + 76 >> 2] = r;
                                    c[q + 7104 >> 2] = 1;
                                    c[q + 7108 >> 2] = -1;
                                    r = n + 16 | 0;
                                    q = n + 12 | 0;
                                    s = 0;
                                    b: while (1) {
                                        t = ha(d | 0, 1, b | 0, e | 0) | 0;
                                        c[p >> 2] = t;
                                        if ((ta(e | 0) | 0) != 0) {
                                            o = 20;
                                            break
                                        }
                                        if ((t | 0) == 0) {
                                            o = 44;
                                            break
                                        }
                                        c[n >> 2] = d;
                                        do {
                                            c[r >> 2] = b;
                                            c[q >> 2] = h;
                                            s = bb(n) | 0;
                                            if ((s | 0) == -2) {
                                                o = 28;
                                                break b
                                            } else if ((s | 0) == 2) {
                                                o = 29;
                                                break b
                                            } else if ((s | 0) == -4 | (s | 0) == -3) {
                                                l = s;
                                                break b
                                            }
                                            y = b - (c[r >> 2] | 0) | 0;
                                            if ((Da(h | 0, 1, y | 0, f | 0) | 0) != (y | 0)) {
                                                o = 37;
                                                break b
                                            }
                                            if ((ta(f | 0) | 0) != 0) {
                                                o = 37;
                                                break b
                                            }
                                        } while ((c[r >> 2] | 0) == 0);
                                        if ((s | 0) == 1) {
                                            s = 1;
                                            o = 44;
                                            break
                                        }
                                    }
                                    if ((o | 0) == 20) {
                                        l = n + 28 | 0;
                                        m = c[l >> 2] | 0;
                                        if ((m | 0) == 0) {
                                            l = -1;
                                            break a
                                        }
                                        o = c[k >> 2] | 0;
                                        if ((o | 0) == 0) {
                                            l = -1;
                                            break a
                                        }
                                        n = c[m + 52 >> 2] | 0;
                                        if ((n | 0) != 0) {
                                            Ia[o & 1](c[j >> 2] | 0, n);
                                            o = c[k >> 2] | 0;
                                            m = c[l >> 2] | 0
                                        }
                                        Ia[o & 1](c[j >> 2] | 0, m);
                                        c[l >> 2] = 0;
                                        l = -1;
                                        break a
                                    } else if ((o | 0) == 28) {
                                        ja(16, 40, 115, 112)
                                    } else if ((o | 0) == 29) {
                                        l = -3
                                    } else if ((o | 0) == 37) {
                                        l = n + 28 | 0;
                                        m = c[l >> 2] | 0;
                                        if ((m | 0) == 0) {
                                            l = -1;
                                            break a
                                        }
                                        n = c[k >> 2] | 0;
                                        if ((n | 0) == 0) {
                                            l = -1;
                                            break a
                                        }
                                        o = c[m + 52 >> 2] | 0;
                                        if ((o | 0) != 0) {
                                            Ia[n & 1](c[j >> 2] | 0, o);
                                            n = c[k >> 2] | 0;
                                            m = c[l >> 2] | 0
                                        }
                                        Ia[n & 1](c[j >> 2] | 0, m);
                                        c[l >> 2] = 0;
                                        l = -1;
                                        break a
                                    } else if ((o | 0) == 44) {
                                        l = n + 28 | 0;
                                        n = c[l >> 2] | 0;
                                        if ((n | 0) != 0 ? (m = c[k >> 2] | 0, (m | 0) != 0) : 0) {
                                            o = c[n + 52 >> 2] | 0;
                                            if ((o | 0) != 0) {
                                                Ia[m & 1](c[j >> 2] | 0, o);
                                                m = c[k >> 2] | 0;
                                                n = c[l >> 2] | 0
                                            }
                                            Ia[m & 1](c[j >> 2] | 0, n);
                                            c[l >> 2] = 0
                                        }
                                        l = (s | 0) == 1 ? 0 : -3;
                                        break a
                                    }
                                    m = n + 28 | 0;
                                    n = c[m >> 2] | 0;
                                    if ((n | 0) == 0) {
                                        break a
                                    }
                                    p = c[k >> 2] | 0;
                                    if ((p | 0) == 0) {
                                        break a
                                    }
                                    o = c[n + 52 >> 2] | 0;
                                    if ((o | 0) != 0) {
                                        Ia[p & 1](c[j >> 2] | 0, o);
                                        p = c[k >> 2] | 0;
                                        n = c[m >> 2] | 0
                                    }
                                    Ia[p & 1](c[j >> 2] | 0, n);
                                    c[m >> 2] = 0;
                                    break a
                                }
                            }
                        } while (0);
                        Ia[c[k >> 2] & 1](c[j >> 2] | 0, r);
                        c[s >> 2] = 0;
                        l = -2
                    }
                } while (0);
                tb(d);
                tb(h);
                wa(e | 0) | 0;
                wa(f | 0) | 0;
                i = g;
                return l | 0
            }
            function Ua(d, f, g, h, j, k, l, m) {
                d = d | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                l = l | 0;
                m = m | 0;
                var n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0;
                n = i;
                if ((l | 0) == 0) {
                    r = -6;
                    i = n;
                    return r | 0
                }
                if (!((a[l >> 0] | 0) == 49 & (m | 0) == 56)) {
                    r = -6;
                    i = n;
                    return r | 0
                }
                if ((d | 0) == 0) {
                    r = -2;
                    i = n;
                    return r | 0
                }
                m = d + 24 | 0;
                c[m >> 2] = 0;
                l = d + 32 | 0;
                p = c[l >> 2] | 0;
                if ((p | 0) == 0) {
                    c[l >> 2] = 1;
                    c[d + 40 >> 2] = 0;
                    p = 1
                }
                o = d + 36 | 0;
                if ((c[o >> 2] | 0) == 0) {
                    c[o >> 2] = 1
                }
                f = (f | 0) == -1 ? 6 : f;
                if ((h | 0) < 0) {
                    q = 0 - h | 0;
                    h = 0
                } else {
                    r = (h | 0) > 15;
                    q = r ? h + -16 | 0 : h;
                    h = r ? 2 : 1
                }
                if ((((j | 0) < 1 | (j | 0) > 9) ^ 1) & (g | 0) == 8 ^ 1 | (q | 0) < 8 | (q | 0) > 15 | (f | 0) < 0 | (f | 0) > 9 | (k | 0) < 0 | (k | 0) > 4) {
                    r = -2;
                    i = n;
                    return r | 0
                }
                q = (q | 0) == 8 ? 9 : q;
                r = d + 40 | 0;
                p = Ha[p & 1](c[r >> 2] | 0, 1, 5828) | 0;
                if ((p | 0) == 0) {
                    r = -4;
                    i = n;
                    return r | 0
                }
                g = d + 28 | 0;
                c[g >> 2] = p;
                c[p >> 2] = d;
                c[p + 24 >> 2] = h;
                c[p + 28 >> 2] = 0;
                c[p + 48 >> 2] = q;
                s = 1 << q;
                q = p + 44 | 0;
                c[q >> 2] = s;
                c[p + 52 >> 2] = s + -1;
                t = j + 7 | 0;
                c[p + 80 >> 2] = t;
                t = 1 << t;
                h = p + 76 | 0;
                c[h >> 2] = t;
                c[p + 84 >> 2] = t + -1;
                c[p + 88 >> 2] = ((j + 9 | 0) >>> 0) / 3 | 0;
                t = p + 56 | 0;
                c[t >> 2] = Ha[c[l >> 2] & 1](c[r >> 2] | 0, s, 2) | 0;
                s = p + 64 | 0;
                c[s >> 2] = Ha[c[l >> 2] & 1](c[r >> 2] | 0, c[q >> 2] | 0, 2) | 0;
                q = p + 68 | 0;
                c[q >> 2] = Ha[c[l >> 2] & 1](c[r >> 2] | 0, c[h >> 2] | 0, 2) | 0;
                c[p + 5824 >> 2] = 0;
                h = 1 << j + 6;
                j = p + 5788 | 0;
                c[j >> 2] = h;
                h = Ha[c[l >> 2] & 1](c[r >> 2] | 0, h, 4) | 0;
                c[p + 8 >> 2] = h;
                j = c[j >> 2] | 0;
                c[p + 12 >> 2] = j << 2;
                if (((c[t >> 2] | 0) != 0 ? (c[s >> 2] | 0) != 0 : 0) ? !((c[q >> 2] | 0) == 0 | (h | 0) == 0) : 0) {
                    c[p + 5796 >> 2] = h + (j >>> 1 << 1);
                    c[p + 5784 >> 2] = h + (j * 3 | 0);
                    c[p + 132 >> 2] = f;
                    c[p + 136 >> 2] = k;
                    a[p + 36 >> 0] = 8;
                    k = c[g >> 2] | 0;
                    if ((k | 0) == 0) {
                        t = -2;
                        i = n;
                        return t | 0
                    }
                    if ((c[l >> 2] | 0) == 0) {
                        t = -2;
                        i = n;
                        return t | 0
                    }
                    if ((c[o >> 2] | 0) == 0) {
                        t = -2;
                        i = n;
                        return t | 0
                    }
                    c[d + 20 >> 2] = 0;
                    c[d + 8 >> 2] = 0;
                    c[m >> 2] = 0;
                    c[d + 44 >> 2] = 2;
                    c[k + 20 >> 2] = 0;
                    c[k + 16 >> 2] = c[k + 8 >> 2];
                    l = k + 24 | 0;
                    m = c[l >> 2] | 0;
                    if ((m | 0) < 0) {
                        m = 0 - m | 0;
                        c[l >> 2] = m
                    }
                    c[k + 4 >> 2] = (m | 0) != 0 ? 42 : 113;
                    if ((m | 0) == 2) {
                        l = 0
                    } else {
                        l = qb(0, 0, 0) | 0
                    }
                    c[d + 48 >> 2] = l;
                    c[k + 40 >> 2] = 0;
                    c[k + 2840 >> 2] = k + 148;
                    c[k + 2848 >> 2] = 3952;
                    c[k + 2852 >> 2] = k + 2440;
                    c[k + 2860 >> 2] = 3976;
                    c[k + 2864 >> 2] = k + 2684;
                    c[k + 2872 >> 2] = 4e3;
                    b[k + 5816 >> 1] = 0;
                    c[k + 5820 >> 2] = 0;
                    db(k);
                    t = c[g >> 2] | 0;
                    c[t + 60 >> 2] = c[t + 44 >> 2] << 1;
                    s = t + 76 | 0;
                    r = t + 68 | 0;
                    b[(c[r >> 2] | 0) + ((c[s >> 2] | 0) + -1 << 1) >> 1] = 0;
                    vb(c[r >> 2] | 0, 0, (c[s >> 2] << 1) + -2 | 0) | 0;
                    s = c[t + 132 >> 2] | 0;
                    c[t + 128 >> 2] = e[154 + (s * 12 | 0) >> 1] | 0;
                    c[t + 140 >> 2] = e[152 + (s * 12 | 0) >> 1] | 0;
                    c[t + 144 >> 2] = e[156 + (s * 12 | 0) >> 1] | 0;
                    c[t + 124 >> 2] = e[158 + (s * 12 | 0) >> 1] | 0;
                    c[t + 108 >> 2] = 0;
                    c[t + 92 >> 2] = 0;
                    c[t + 116 >> 2] = 0;
                    c[t + 5812 >> 2] = 0;
                    c[t + 120 >> 2] = 2;
                    c[t + 96 >> 2] = 2;
                    c[t + 104 >> 2] = 0;
                    c[t + 72 >> 2] = 0;
                    t = 0;
                    i = n;
                    return t | 0
                }
                c[p + 4 >> 2] = 666;
                c[m >> 2] = 5896;
                Va(d) | 0;
                t = -4;
                i = n;
                return t | 0
            }
            function Va(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0;
                e = i;
                if ((a | 0) == 0) {
                    h = -2;
                    i = e;
                    return h | 0
                }
                b = a + 28 | 0;
                g = c[b >> 2] | 0;
                if ((g | 0) == 0) {
                    h = -2;
                    i = e;
                    return h | 0
                }
                d = c[g + 4 >> 2] | 0;
                switch (d | 0) {
                    case 666:
                    case 113:
                    case 103:
                    case 91:
                    case 73:
                    case 69:
                    case 42:
                        {
                            break
                        }
                        ;
                    default:
                        {
                            h = -2;
                            i = e;
                            return h | 0
                        }
                }
                f = c[g + 8 >> 2] | 0;
                if ((f | 0) != 0) {
                    Ia[c[a + 36 >> 2] & 1](c[a + 40 >> 2] | 0, f);
                    g = c[b >> 2] | 0
                }
                f = c[g + 68 >> 2] | 0;
                if ((f | 0) != 0) {
                    Ia[c[a + 36 >> 2] & 1](c[a + 40 >> 2] | 0, f);
                    g = c[b >> 2] | 0
                }
                f = c[g + 64 >> 2] | 0;
                if ((f | 0) != 0) {
                    Ia[c[a + 36 >> 2] & 1](c[a + 40 >> 2] | 0, f);
                    g = c[b >> 2] | 0
                }
                h = c[g + 56 >> 2] | 0;
                f = a + 36 | 0;
                if ((h | 0) == 0) {
                    a = a + 40 | 0
                } else {
                    a = a + 40 | 0;
                    Ia[c[f >> 2] & 1](c[a >> 2] | 0, h);
                    g = c[b >> 2] | 0
                }
                Ia[c[f >> 2] & 1](c[a >> 2] | 0, g);
                c[b >> 2] = 0;
                h = (d | 0) == 113 ? -3 : 0;
                i = e;
                return h | 0
            }
            function Wa(a) {
                a = a | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0;
                g = i;
                v = a + 44 | 0;
                s = c[v >> 2] | 0;
                k = a + 60 | 0;
                h = a + 116 | 0;
                j = a + 108 | 0;
                f = a + 56 | 0;
                p = a + 5812 | 0;
                q = a + 72 | 0;
                r = a + 88 | 0;
                w = a + 84 | 0;
                m = a + 68 | 0;
                o = a + 52 | 0;
                n = a + 64 | 0;
                l = a + 112 | 0;
                t = a + 92 | 0;
                u = a + 76 | 0;
                y = c[h >> 2] | 0;
                z = s;
                while (1) {
                    D = c[j >> 2] | 0;
                    y = (c[k >> 2] | 0) - y - D | 0;
                    if (!(D >>> 0 < (s + (z + -262) | 0) >>> 0)) {
                        z = c[f >> 2] | 0;
                        xb(z | 0, z + s | 0, s | 0) | 0;
                        c[l >> 2] = (c[l >> 2] | 0) - s;
                        c[j >> 2] = (c[j >> 2] | 0) - s;
                        c[t >> 2] = (c[t >> 2] | 0) - s;
                        z = c[u >> 2] | 0;
                        A = z;
                        z = (c[m >> 2] | 0) + (z << 1) | 0;
                        do {
                            z = z + -2 | 0;
                            B = e[z >> 1] | 0;
                            if (B >>> 0 < s >>> 0) {
                                B = 0
                            } else {
                                B = B - s & 65535
                            }
                            b[z >> 1] = B;
                            A = A + -1 | 0
                        } while ((A | 0) != 0);
                        A = s;
                        z = (c[n >> 2] | 0) + (s << 1) | 0;
                        do {
                            z = z + -2 | 0;
                            B = e[z >> 1] | 0;
                            if (B >>> 0 < s >>> 0) {
                                B = 0
                            } else {
                                B = B - s & 65535
                            }
                            b[z >> 1] = B;
                            A = A + -1 | 0
                        } while ((A | 0) != 0);
                        y = y + s | 0
                    }
                    A = c[a >> 2] | 0;
                    C = A + 4 | 0;
                    B = c[C >> 2] | 0;
                    if ((B | 0) == 0) {
                        break
                    }
                    D = c[h >> 2] | 0;
                    z = (c[f >> 2] | 0) + ((c[j >> 2] | 0) + D) | 0;
                    if (B >>> 0 > y >>> 0) {
                        if ((y | 0) == 0) {
                            y = 0
                        } else {
                            x = 15
                        }
                    } else {
                        y = B;
                        x = 15
                    }
                    if ((x | 0) == 15) {
                        x = 0;
                        c[C >> 2] = B - y;
                        xb(z | 0, c[A >> 2] | 0, y | 0) | 0;
                        B = c[(c[A + 28 >> 2] | 0) + 24 >> 2] | 0;
                        if ((B | 0) == 1) {
                            D = A + 48 | 0;
                            c[D >> 2] = qb(c[D >> 2] | 0, z, y) | 0
                        } else if ((B | 0) == 2) {
                            D = A + 48 | 0;
                            c[D >> 2] = rb(c[D >> 2] | 0, z, y) | 0
                        }
                        c[A >> 2] = (c[A >> 2] | 0) + y;
                        D = A + 8 | 0;
                        c[D >> 2] = (c[D >> 2] | 0) + y;
                        D = c[h >> 2] | 0
                    }
                    z = D + y | 0;
                    c[h >> 2] = z;
                    y = c[p >> 2] | 0;
                    a: do {
                        if ((z + y | 0) >>> 0 > 2) {
                            D = (c[j >> 2] | 0) - y | 0;
                            A = c[f >> 2] | 0;
                            C = d[A + D >> 0] | 0;
                            c[q >> 2] = C;
                            c[q >> 2] = (C << c[r >> 2] ^ (d[A + (D + 1) >> 0] | 0)) & c[w >> 2];
                            A = z;
                            z = D;
                            while (1) {
                                if ((y | 0) == 0) {
                                    z = A;
                                    break a
                                }
                                y = (c[q >> 2] << c[r >> 2] ^ (d[(c[f >> 2] | 0) + (z + 2) >> 0] | 0)) & c[w >> 2];
                                c[q >> 2] = y;
                                b[(c[n >> 2] | 0) + ((z & c[o >> 2]) << 1) >> 1] = b[(c[m >> 2] | 0) + (y << 1) >> 1] | 0;
                                b[(c[m >> 2] | 0) + (c[q >> 2] << 1) >> 1] = z;
                                y = (c[p >> 2] | 0) + -1 | 0;
                                c[p >> 2] = y;
                                A = c[h >> 2] | 0;
                                if ((A + y | 0) >>> 0 < 3) {
                                    z = A;
                                    break
                                } else {
                                    z = z + 1 | 0
                                }
                            }
                        }
                    } while (0);
                    if (!(z >>> 0 < 262)) {
                        break
                    }
                    if ((c[(c[a >> 2] | 0) + 4 >> 2] | 0) == 0) {
                        break
                    }
                    y = z;
                    z = c[v >> 2] | 0
                }
                m = a + 5824 | 0;
                l = c[m >> 2] | 0;
                k = c[k >> 2] | 0;
                if (!(l >>> 0 < k >>> 0)) {
                    i = g;
                    return
                }
                h = (c[j >> 2] | 0) + (c[h >> 2] | 0) | 0;
                if (l >>> 0 < h >>> 0) {
                    D = k - h | 0;
                    D = D >>> 0 > 258 ? 258 : D;
                    vb((c[f >> 2] | 0) + h | 0, 0, D | 0) | 0;
                    c[m >> 2] = h + D;
                    i = g;
                    return
                }
                h = h + 258 | 0;
                if (!(l >>> 0 < h >>> 0)) {
                    i = g;
                    return
                }
                D = h - l | 0;
                C = k - l | 0;
                D = D >>> 0 > C >>> 0 ? C : D;
                vb((c[f >> 2] | 0) + l | 0, 0, D | 0) | 0;
                c[m >> 2] = (c[m >> 2] | 0) + D;
                i = g;
                return
            }
            function Xa(e, f) {
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0;
                g = i;
                if ((e | 0) == 0) {
                    E = -2;
                    i = g;
                    return E | 0
                }
                h = c[e + 28 >> 2] | 0;
                if ((h | 0) == 0 | (f | 0) > 5 | (f | 0) < 0) {
                    E = -2;
                    i = g;
                    return E | 0
                }
                do {
                    if ((c[e + 12 >> 2] | 0) != 0) {
                        if ((c[e >> 2] | 0) == 0 ? (c[e + 4 >> 2] | 0) != 0 : 0) {
                            break
                        }
                        l = h + 4 | 0;
                        v = c[l >> 2] | 0;
                        if ((v | 0) != 666 | (f | 0) == 4) {
                            k = e + 16 | 0;
                            if ((c[k >> 2] | 0) == 0) {
                                c[e + 24 >> 2] = 5920;
                                E = -5;
                                i = g;
                                return E | 0
                            }
                            c[h >> 2] = e;
                            j = h + 40 | 0;
                            q = c[j >> 2] | 0;
                            c[j >> 2] = f;
                            do {
                                if ((v | 0) == 42) {
                                    if ((c[h + 24 >> 2] | 0) != 2) {
                                        p = (c[h + 48 >> 2] << 12) + -30720 | 0;
                                        if ((c[h + 136 >> 2] | 0) <= 1 ? (u = c[h + 132 >> 2] | 0, (u | 0) >= 2) : 0) {
                                            if ((u | 0) < 6) {
                                                u = 64
                                            } else {
                                                u = (u | 0) == 6 ? 128 : 192
                                            }
                                        } else {
                                            u = 0
                                        }
                                        D = p | u;
                                        E = h + 108 | 0;
                                        D = (c[E >> 2] | 0) == 0 ? D : D | 32;
                                        D = D + (((D >>> 0) % 31 | 0) ^ 31) | 0;
                                        c[l >> 2] = 113;
                                        v = h + 20 | 0;
                                        u = c[v >> 2] | 0;
                                        c[v >> 2] = u + 1;
                                        p = h + 8 | 0;
                                        a[(c[p >> 2] | 0) + u >> 0] = D >>> 8;
                                        u = c[v >> 2] | 0;
                                        c[v >> 2] = u + 1;
                                        a[(c[p >> 2] | 0) + u >> 0] = D;
                                        u = e + 48 | 0;
                                        if ((c[E >> 2] | 0) != 0) {
                                            E = c[u >> 2] | 0;
                                            D = c[v >> 2] | 0;
                                            c[v >> 2] = D + 1;
                                            a[(c[p >> 2] | 0) + D >> 0] = E >>> 24;
                                            D = c[v >> 2] | 0;
                                            c[v >> 2] = D + 1;
                                            a[(c[p >> 2] | 0) + D >> 0] = E >>> 16;
                                            D = c[u >> 2] | 0;
                                            E = c[v >> 2] | 0;
                                            c[v >> 2] = E + 1;
                                            a[(c[p >> 2] | 0) + E >> 0] = D >>> 8;
                                            E = c[v >> 2] | 0;
                                            c[v >> 2] = E + 1;
                                            a[(c[p >> 2] | 0) + E >> 0] = D
                                        }
                                        c[u >> 2] = qb(0, 0, 0) | 0;
                                        w = c[l >> 2] | 0;
                                        p = 32;
                                        break
                                    }
                                    x = e + 48 | 0;
                                    c[x >> 2] = 0;
                                    v = h + 20 | 0;
                                    y = c[v >> 2] | 0;
                                    c[v >> 2] = y + 1;
                                    u = h + 8 | 0;
                                    a[(c[u >> 2] | 0) + y >> 0] = 31;
                                    y = c[v >> 2] | 0;
                                    c[v >> 2] = y + 1;
                                    a[(c[u >> 2] | 0) + y >> 0] = -117;
                                    y = c[v >> 2] | 0;
                                    c[v >> 2] = y + 1;
                                    a[(c[u >> 2] | 0) + y >> 0] = 8;
                                    y = h + 28 | 0;
                                    z = c[y >> 2] | 0;
                                    if ((z | 0) == 0) {
                                        r = c[v >> 2] | 0;
                                        c[v >> 2] = r + 1;
                                        a[(c[u >> 2] | 0) + r >> 0] = 0;
                                        r = c[v >> 2] | 0;
                                        c[v >> 2] = r + 1;
                                        a[(c[u >> 2] | 0) + r >> 0] = 0;
                                        r = c[v >> 2] | 0;
                                        c[v >> 2] = r + 1;
                                        a[(c[u >> 2] | 0) + r >> 0] = 0;
                                        r = c[v >> 2] | 0;
                                        c[v >> 2] = r + 1;
                                        a[(c[u >> 2] | 0) + r >> 0] = 0;
                                        r = c[v >> 2] | 0;
                                        c[v >> 2] = r + 1;
                                        a[(c[u >> 2] | 0) + r >> 0] = 0;
                                        r = c[h + 132 >> 2] | 0;
                                        if ((r | 0) != 9) {
                                            if ((c[h + 136 >> 2] | 0) > 1) {
                                                r = 4
                                            } else {
                                                r = (r | 0) < 2 ? 4 : 0
                                            }
                                        } else {
                                            r = 2
                                        }
                                        E = c[v >> 2] | 0;
                                        c[v >> 2] = E + 1;
                                        a[(c[u >> 2] | 0) + E >> 0] = r;
                                        E = c[v >> 2] | 0;
                                        c[v >> 2] = E + 1;
                                        a[(c[u >> 2] | 0) + E >> 0] = 3;
                                        c[l >> 2] = 113;
                                        break
                                    }
                                    E = ((c[z >> 2] | 0) != 0 | ((c[z + 44 >> 2] | 0) != 0 ? 2 : 0) | ((c[z + 16 >> 2] | 0) == 0 ? 0 : 4) | ((c[z + 28 >> 2] | 0) == 0 ? 0 : 8) | ((c[z + 36 >> 2] | 0) == 0 ? 0 : 16)) & 255;
                                    p = c[v >> 2] | 0;
                                    c[v >> 2] = p + 1;
                                    a[(c[u >> 2] | 0) + p >> 0] = E;
                                    p = c[(c[y >> 2] | 0) + 4 >> 2] & 255;
                                    E = c[v >> 2] | 0;
                                    c[v >> 2] = E + 1;
                                    a[(c[u >> 2] | 0) + E >> 0] = p;
                                    E = (c[(c[y >> 2] | 0) + 4 >> 2] | 0) >>> 8 & 255;
                                    p = c[v >> 2] | 0;
                                    c[v >> 2] = p + 1;
                                    a[(c[u >> 2] | 0) + p >> 0] = E;
                                    p = (c[(c[y >> 2] | 0) + 4 >> 2] | 0) >>> 16 & 255;
                                    E = c[v >> 2] | 0;
                                    c[v >> 2] = E + 1;
                                    a[(c[u >> 2] | 0) + E >> 0] = p;
                                    E = (c[(c[y >> 2] | 0) + 4 >> 2] | 0) >>> 24 & 255;
                                    p = c[v >> 2] | 0;
                                    c[v >> 2] = p + 1;
                                    a[(c[u >> 2] | 0) + p >> 0] = E;
                                    p = c[h + 132 >> 2] | 0;
                                    if ((p | 0) != 9) {
                                        if ((c[h + 136 >> 2] | 0) > 1) {
                                            p = 4
                                        } else {
                                            p = (p | 0) < 2 ? 4 : 0
                                        }
                                    } else {
                                        p = 2
                                    }
                                    E = c[v >> 2] | 0;
                                    c[v >> 2] = E + 1;
                                    a[(c[u >> 2] | 0) + E >> 0] = p;
                                    E = c[(c[y >> 2] | 0) + 12 >> 2] & 255;
                                    p = c[v >> 2] | 0;
                                    c[v >> 2] = p + 1;
                                    a[(c[u >> 2] | 0) + p >> 0] = E;
                                    p = c[y >> 2] | 0;
                                    if ((c[p + 16 >> 2] | 0) != 0) {
                                        p = c[p + 20 >> 2] & 255;
                                        E = c[v >> 2] | 0;
                                        c[v >> 2] = E + 1;
                                        a[(c[u >> 2] | 0) + E >> 0] = p;
                                        E = (c[(c[y >> 2] | 0) + 20 >> 2] | 0) >>> 8 & 255;
                                        p = c[v >> 2] | 0;
                                        c[v >> 2] = p + 1;
                                        a[(c[u >> 2] | 0) + p >> 0] = E;
                                        p = c[y >> 2] | 0
                                    }
                                    if ((c[p + 44 >> 2] | 0) != 0) {
                                        c[x >> 2] = rb(c[x >> 2] | 0, c[u >> 2] | 0, c[v >> 2] | 0) | 0
                                    }
                                    c[h + 32 >> 2] = 0;
                                    c[l >> 2] = 69;
                                    p = 33
                                } else {
                                    w = v;
                                    p = 32
                                }
                            } while (0);
                            if ((p | 0) == 32) {
                                if ((w | 0) == 69) {
                                    p = 33
                                } else {
                                    p = 50
                                }
                            }
                            do {
                                if ((p | 0) == 33) {
                                    x = h + 28 | 0;
                                    B = c[x >> 2] | 0;
                                    if ((c[B + 16 >> 2] | 0) == 0) {
                                        c[l >> 2] = 73;
                                        p = 51;
                                        break
                                    }
                                    w = h + 20 | 0;
                                    u = h + 32 | 0;
                                    z = h + 12 | 0;
                                    v = e + 48 | 0;
                                    y = h + 8 | 0;
                                    C = c[u >> 2] | 0;
                                    A = c[w >> 2] | 0;
                                    while (1) {
                                        if (!(C >>> 0 < (c[B + 20 >> 2] & 65535) >>> 0)) {
                                            break
                                        }
                                        D = c[w >> 2] | 0;
                                        if ((D | 0) == (c[z >> 2] | 0)) {
                                            if ((c[B + 44 >> 2] | 0) != 0 & D >>> 0 > A >>> 0) {
                                                c[v >> 2] = rb(c[v >> 2] | 0, (c[y >> 2] | 0) + A | 0, D - A | 0) | 0
                                            }
                                            Ya(e);
                                            A = c[w >> 2] | 0;
                                            if ((A | 0) == (c[z >> 2] | 0)) {
                                                p = 41;
                                                break
                                            }
                                            B = c[x >> 2] | 0;
                                            C = c[u >> 2] | 0;
                                            D = A
                                        }
                                        C = a[(c[B + 16 >> 2] | 0) + C >> 0] | 0;
                                        c[w >> 2] = D + 1;
                                        a[(c[y >> 2] | 0) + D >> 0] = C;
                                        C = (c[u >> 2] | 0) + 1 | 0;
                                        c[u >> 2] = C;
                                        B = c[x >> 2] | 0
                                    }
                                    if ((p | 0) == 41) {
                                        B = c[x >> 2] | 0
                                    }
                                    if ((c[B + 44 >> 2] | 0) != 0 ? (t = c[w >> 2] | 0, t >>> 0 > A >>> 0) : 0) {
                                        c[v >> 2] = rb(c[v >> 2] | 0, (c[y >> 2] | 0) + A | 0, t - A | 0) | 0;
                                        B = c[x >> 2] | 0
                                    }
                                    if ((c[u >> 2] | 0) == (c[B + 20 >> 2] | 0)) {
                                        c[u >> 2] = 0;
                                        c[l >> 2] = 73;
                                        p = 51;
                                        break
                                    } else {
                                        w = c[l >> 2] | 0;
                                        p = 50;
                                        break
                                    }
                                }
                            } while (0);
                            if ((p | 0) == 50) {
                                if ((w | 0) == 73) {
                                    p = 51
                                } else {
                                    p = 66
                                }
                            }
                            do {
                                if ((p | 0) == 51) {
                                    p = h + 28 | 0;
                                    if ((c[(c[p >> 2] | 0) + 28 >> 2] | 0) == 0) {
                                        c[l >> 2] = 91;
                                        p = 67;
                                        break
                                    }
                                    w = h + 20 | 0;
                                    z = c[w >> 2] | 0;
                                    x = h + 12 | 0;
                                    u = e + 48 | 0;
                                    v = h + 8 | 0;
                                    t = h + 32 | 0;
                                    y = z;
                                    while (1) {
                                        if ((y | 0) == (c[x >> 2] | 0)) {
                                            if (y >>> 0 > z >>> 0 ? (c[(c[p >> 2] | 0) + 44 >> 2] | 0) != 0 : 0) {
                                                c[u >> 2] = rb(c[u >> 2] | 0, (c[v >> 2] | 0) + z | 0, y - z | 0) | 0
                                            }
                                            Ya(e);
                                            z = c[w >> 2] | 0;
                                            if ((z | 0) == (c[x >> 2] | 0)) {
                                                x = 1;
                                                break
                                            } else {
                                                y = z
                                            }
                                        }
                                        E = c[t >> 2] | 0;
                                        c[t >> 2] = E + 1;
                                        E = a[(c[(c[p >> 2] | 0) + 28 >> 2] | 0) + E >> 0] | 0;
                                        c[w >> 2] = y + 1;
                                        a[(c[v >> 2] | 0) + y >> 0] = E;
                                        if (E << 24 >> 24 == 0) {
                                            x = 0;
                                            break
                                        }
                                        y = c[w >> 2] | 0
                                    }
                                    if ((c[(c[p >> 2] | 0) + 44 >> 2] | 0) != 0 ? (s = c[w >> 2] | 0, s >>> 0 > z >>> 0) : 0) {
                                        c[u >> 2] = rb(c[u >> 2] | 0, (c[v >> 2] | 0) + z | 0, s - z | 0) | 0
                                    }
                                    if ((x | 0) == 0) {
                                        c[t >> 2] = 0;
                                        c[l >> 2] = 91;
                                        p = 67;
                                        break
                                    } else {
                                        w = c[l >> 2] | 0;
                                        p = 66;
                                        break
                                    }
                                }
                            } while (0);
                            if ((p | 0) == 66) {
                                if ((w | 0) == 91) {
                                    p = 67
                                } else {
                                    p = 82
                                }
                            }
                            do {
                                if ((p | 0) == 67) {
                                    s = h + 28 | 0;
                                    if ((c[(c[s >> 2] | 0) + 36 >> 2] | 0) == 0) {
                                        c[l >> 2] = 103;
                                        p = 83;
                                        break
                                    }
                                    u = h + 20 | 0;
                                    y = c[u >> 2] | 0;
                                    w = h + 12 | 0;
                                    p = e + 48 | 0;
                                    t = h + 8 | 0;
                                    v = h + 32 | 0;
                                    x = y;
                                    while (1) {
                                        if ((x | 0) == (c[w >> 2] | 0)) {
                                            if (x >>> 0 > y >>> 0 ? (c[(c[s >> 2] | 0) + 44 >> 2] | 0) != 0 : 0) {
                                                c[p >> 2] = rb(c[p >> 2] | 0, (c[t >> 2] | 0) + y | 0, x - y | 0) | 0
                                            }
                                            Ya(e);
                                            y = c[u >> 2] | 0;
                                            if ((y | 0) == (c[w >> 2] | 0)) {
                                                v = 1;
                                                break
                                            } else {
                                                x = y
                                            }
                                        }
                                        E = c[v >> 2] | 0;
                                        c[v >> 2] = E + 1;
                                        E = a[(c[(c[s >> 2] | 0) + 36 >> 2] | 0) + E >> 0] | 0;
                                        c[u >> 2] = x + 1;
                                        a[(c[t >> 2] | 0) + x >> 0] = E;
                                        if (E << 24 >> 24 == 0) {
                                            v = 0;
                                            break
                                        }
                                        x = c[u >> 2] | 0
                                    }
                                    if ((c[(c[s >> 2] | 0) + 44 >> 2] | 0) != 0 ? (r = c[u >> 2] | 0, r >>> 0 > y >>> 0) : 0) {
                                        c[p >> 2] = rb(c[p >> 2] | 0, (c[t >> 2] | 0) + y | 0, r - y | 0) | 0
                                    }
                                    if ((v | 0) == 0) {
                                        c[l >> 2] = 103;
                                        p = 83;
                                        break
                                    } else {
                                        w = c[l >> 2] | 0;
                                        p = 82;
                                        break
                                    }
                                }
                            } while (0);
                            if ((p | 0) == 82 ? (w | 0) == 103 : 0) {
                                p = 83
                            }
                            do {
                                if ((p | 0) == 83) {
                                    if ((c[(c[h + 28 >> 2] | 0) + 44 >> 2] | 0) == 0) {
                                        c[l >> 2] = 113;
                                        break
                                    }
                                    p = h + 20 | 0;
                                    r = c[p >> 2] | 0;
                                    s = h + 12 | 0;
                                    t = c[s >> 2] | 0;
                                    if ((r + 2 | 0) >>> 0 > t >>> 0) {
                                        Ya(e);
                                        r = c[p >> 2] | 0;
                                        t = c[s >> 2] | 0
                                    }
                                    if (!((r + 2 | 0) >>> 0 > t >>> 0)) {
                                        E = e + 48 | 0;
                                        B = c[E >> 2] & 255;
                                        c[p >> 2] = r + 1;
                                        C = h + 8 | 0;
                                        a[(c[C >> 2] | 0) + r >> 0] = B;
                                        B = (c[E >> 2] | 0) >>> 8 & 255;
                                        D = c[p >> 2] | 0;
                                        c[p >> 2] = D + 1;
                                        a[(c[C >> 2] | 0) + D >> 0] = B;
                                        c[E >> 2] = 0;
                                        c[l >> 2] = 113
                                    }
                                }
                            } while (0);
                            r = h + 20 | 0;
                            if ((c[r >> 2] | 0) == 0) {
                                if ((c[e + 4 >> 2] | 0) == 0 ? !((f | 0) == 4 ? 1 : ((f << 1) - ((f | 0) > 4 ? 9 : 0) | 0) > ((q << 1) - ((q | 0) > 4 ? 9 : 0) | 0)) : 0) {
                                    c[e + 24 >> 2] = 5920;
                                    E = -5;
                                    i = g;
                                    return E | 0
                                }
                            } else {
                                Ya(e);
                                if ((c[k >> 2] | 0) == 0) {
                                    c[j >> 2] = -1;
                                    E = 0;
                                    i = g;
                                    return E | 0
                                }
                            }
                            q = (c[l >> 2] | 0) == 666;
                            p = (c[e + 4 >> 2] | 0) == 0;
                            if (q) {
                                if (p) {
                                    p = 99
                                } else {
                                    c[e + 24 >> 2] = 5920;
                                    E = -5;
                                    i = g;
                                    return E | 0
                                }
                            } else {
                                if (p) {
                                    p = 99
                                } else {
                                    p = 102
                                }
                            }
                            do {
                                if ((p | 0) == 99) {
                                    if ((c[h + 116 >> 2] | 0) == 0) {
                                        if ((f | 0) != 0) {
                                            if (q) {
                                                break
                                            } else {
                                                p = 102;
                                                break
                                            }
                                        } else {
                                            E = 0;
                                            i = g;
                                            return E | 0
                                        }
                                    } else {
                                        p = 102
                                    }
                                }
                            } while (0);
                            a: do {
                                if ((p | 0) == 102) {
                                    q = c[h + 136 >> 2] | 0;
                                    b: do {
                                        if ((q | 0) == 2) {
                                            w = h + 116 | 0;
                                            s = h + 96 | 0;
                                            n = h + 108 | 0;
                                            o = h + 56 | 0;
                                            q = h + 5792 | 0;
                                            t = h + 5796 | 0;
                                            u = h + 5784 | 0;
                                            v = h + 5788 | 0;
                                            m = h + 92 | 0;
                                            while (1) {
                                                if ((c[w >> 2] | 0) == 0 ? (Wa(h), (c[w >> 2] | 0) == 0) : 0) {
                                                    break
                                                }
                                                c[s >> 2] = 0;
                                                E = a[(c[o >> 2] | 0) + (c[n >> 2] | 0) >> 0] | 0;
                                                b[(c[t >> 2] | 0) + (c[q >> 2] << 1) >> 1] = 0;
                                                x = c[q >> 2] | 0;
                                                c[q >> 2] = x + 1;
                                                a[(c[u >> 2] | 0) + x >> 0] = E;
                                                E = h + ((E & 255) << 2) + 148 | 0;
                                                b[E >> 1] = (b[E >> 1] | 0) + 1 << 16 >> 16;
                                                E = (c[q >> 2] | 0) == ((c[v >> 2] | 0) + -1 | 0);
                                                c[w >> 2] = (c[w >> 2] | 0) + -1;
                                                x = (c[n >> 2] | 0) + 1 | 0;
                                                c[n >> 2] = x;
                                                if (!E) {
                                                    continue
                                                }
                                                y = c[m >> 2] | 0;
                                                if ((y | 0) > -1) {
                                                    z = (c[o >> 2] | 0) + y | 0
                                                } else {
                                                    z = 0
                                                }
                                                hb(h, z, x - y | 0, 0);
                                                c[m >> 2] = c[n >> 2];
                                                Ya(c[h >> 2] | 0);
                                                if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) == 0) {
                                                    break b
                                                }
                                            }
                                            if ((f | 0) != 0) {
                                                c[h + 5812 >> 2] = 0;
                                                if ((f | 0) == 4) {
                                                    p = c[m >> 2] | 0;
                                                    if ((p | 0) > -1) {
                                                        o = (c[o >> 2] | 0) + p | 0
                                                    } else {
                                                        o = 0
                                                    }
                                                    hb(h, o, (c[n >> 2] | 0) - p | 0, 1);
                                                    c[m >> 2] = c[n >> 2];
                                                    Ya(c[h >> 2] | 0);
                                                    if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) == 0) {
                                                        p = 158;
                                                        break
                                                    } else {
                                                        p = 156;
                                                        break
                                                    }
                                                }
                                                if ((c[q >> 2] | 0) != 0) {
                                                    l = c[m >> 2] | 0;
                                                    if ((l | 0) > -1) {
                                                        o = (c[o >> 2] | 0) + l | 0
                                                    } else {
                                                        o = 0
                                                    }
                                                    hb(h, o, (c[n >> 2] | 0) - l | 0, 0);
                                                    c[m >> 2] = c[n >> 2];
                                                    Ya(c[h >> 2] | 0);
                                                    if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) != 0) {
                                                        p = 162
                                                    }
                                                } else {
                                                    p = 162
                                                }
                                            }
                                        } else if ((q | 0) == 3) {
                                            y = h + 116 | 0;
                                            w = (f | 0) == 0;
                                            v = h + 96 | 0;
                                            q = h + 108 | 0;
                                            t = h + 56 | 0;
                                            u = h + 5792 | 0;
                                            A = h + 5796 | 0;
                                            z = h + 5784 | 0;
                                            x = h + 5788 | 0;
                                            s = h + 92 | 0;
                                            while (1) {
                                                B = c[y >> 2] | 0;
                                                if (B >>> 0 < 259) {
                                                    Wa(h);
                                                    B = c[y >> 2] | 0;
                                                    if (B >>> 0 < 259) {
                                                        if (w) {
                                                            break b
                                                        }
                                                        if ((B | 0) == 0) {
                                                            break
                                                        }
                                                        c[v >> 2] = 0;
                                                        if (B >>> 0 > 2) {
                                                            p = 127
                                                        } else {
                                                            p = 142
                                                        }
                                                    } else {
                                                        p = 125
                                                    }
                                                } else {
                                                    p = 125
                                                }
                                                if ((p | 0) == 125) {
                                                    c[v >> 2] = 0;
                                                    p = 127
                                                }
                                                if ((p | 0) == 127) {
                                                    p = 0;
                                                    C = c[q >> 2] | 0;
                                                    if ((((C | 0) != 0 ? (n = c[t >> 2] | 0, m = a[n + (C + -1) >> 0] | 0, m << 24 >> 24 == (a[n + C >> 0] | 0)) : 0) ? m << 24 >> 24 == (a[n + (C + 1) >> 0] | 0) : 0) ? (o = n + (C + 2) | 0, m << 24 >> 24 == (a[o >> 0] | 0)) : 0) {
                                                        C = n + (C + 258) | 0;
                                                        D = o;
                                                        do {
                                                            E = D + 1 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 2 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 3 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 4 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 5 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 6 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            E = D + 7 | 0;
                                                            if (!(m << 24 >> 24 == (a[E >> 0] | 0))) {
                                                                D = E;
                                                                break
                                                            }
                                                            D = D + 8 | 0
                                                        } while (D >>> 0 < C >>> 0 ? m << 24 >> 24 == (a[D >> 0] | 0) : 0);
                                                        E = D - C + 258 | 0;
                                                        c[v >> 2] = E;
                                                        D = E >>> 0 > B >>> 0;
                                                        c[v >> 2] = D ? B : E;
                                                        B = D ? B : E;
                                                        if (B >>> 0 > 2) {
                                                            C = B + 253 | 0;
                                                            b[(c[A >> 2] | 0) + (c[u >> 2] << 1) >> 1] = 1;
                                                            B = c[u >> 2] | 0;
                                                            c[u >> 2] = B + 1;
                                                            a[(c[z >> 2] | 0) + B >> 0] = C;
                                                            C = h + ((d[3696 + (C & 255) >> 0] | 256) + 1 << 2) + 148 | 0;
                                                            b[C >> 1] = (b[C >> 1] | 0) + 1 << 16 >> 16;
                                                            C = h + 2440 | 0;
                                                            b[C >> 1] = (b[C >> 1] | 0) + 1 << 16 >> 16;
                                                            C = (c[u >> 2] | 0) == ((c[x >> 2] | 0) + -1 | 0) & 1;
                                                            B = c[v >> 2] | 0;
                                                            c[y >> 2] = (c[y >> 2] | 0) - B;
                                                            B = (c[q >> 2] | 0) + B | 0;
                                                            c[q >> 2] = B;
                                                            c[v >> 2] = 0
                                                        } else {
                                                            p = 142
                                                        }
                                                    } else {
                                                        p = 142
                                                    }
                                                }
                                                if ((p | 0) == 142) {
                                                    p = 0;
                                                    C = a[(c[t >> 2] | 0) + (c[q >> 2] | 0) >> 0] | 0;
                                                    b[(c[A >> 2] | 0) + (c[u >> 2] << 1) >> 1] = 0;
                                                    B = c[u >> 2] | 0;
                                                    c[u >> 2] = B + 1;
                                                    a[(c[z >> 2] | 0) + B >> 0] = C;
                                                    C = h + ((C & 255) << 2) + 148 | 0;
                                                    b[C >> 1] = (b[C >> 1] | 0) + 1 << 16 >> 16;
                                                    C = (c[u >> 2] | 0) == ((c[x >> 2] | 0) + -1 | 0) & 1;
                                                    c[y >> 2] = (c[y >> 2] | 0) + -1;
                                                    B = (c[q >> 2] | 0) + 1 | 0;
                                                    c[q >> 2] = B
                                                }
                                                if ((C | 0) == 0) {
                                                    continue
                                                }
                                                D = c[s >> 2] | 0;
                                                if ((D | 0) > -1) {
                                                    C = (c[t >> 2] | 0) + D | 0
                                                } else {
                                                    C = 0
                                                }
                                                hb(h, C, B - D | 0, 0);
                                                c[s >> 2] = c[q >> 2];
                                                Ya(c[h >> 2] | 0);
                                                if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) == 0) {
                                                    break b
                                                }
                                            }
                                            c[h + 5812 >> 2] = 0;
                                            if ((f | 0) == 4) {
                                                m = c[s >> 2] | 0;
                                                if ((m | 0) > -1) {
                                                    n = (c[t >> 2] | 0) + m | 0
                                                } else {
                                                    n = 0
                                                }
                                                hb(h, n, (c[q >> 2] | 0) - m | 0, 1);
                                                c[s >> 2] = c[q >> 2];
                                                Ya(c[h >> 2] | 0);
                                                if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) == 0) {
                                                    p = 158;
                                                    break
                                                } else {
                                                    p = 156;
                                                    break
                                                }
                                            }
                                            if ((c[u >> 2] | 0) != 0) {
                                                l = c[s >> 2] | 0;
                                                if ((l | 0) > -1) {
                                                    m = (c[t >> 2] | 0) + l | 0
                                                } else {
                                                    m = 0
                                                }
                                                hb(h, m, (c[q >> 2] | 0) - l | 0, 0);
                                                c[s >> 2] = c[q >> 2];
                                                Ya(c[h >> 2] | 0);
                                                if ((c[(c[h >> 2] | 0) + 16 >> 2] | 0) != 0) {
                                                    p = 162
                                                }
                                            } else {
                                                p = 162
                                            }
                                        } else {
                                            m = Ja[c[160 + ((c[h + 132 >> 2] | 0) * 12 | 0) >> 2] & 3](h, f) | 0;
                                            if ((m | 0) != 2) {
                                                if ((m | 0) != 3) {
                                                    if ((m | 0) != 0) {
                                                        if ((m | 0) == 1) {
                                                            p = 162
                                                        } else {
                                                            break a
                                                        }
                                                    }
                                                } else {
                                                    p = 156
                                                }
                                            } else {
                                                p = 158
                                            }
                                        }
                                    } while (0);
                                    if ((p | 0) == 156) {
                                        c[l >> 2] = 666;
                                        break
                                    } else if ((p | 0) == 158) {
                                        c[l >> 2] = 666
                                    } else if ((p | 0) == 162) {
                                        if ((f | 0) == 1) {
                                            gb(h)
                                        } else if (((f | 0) != 5 ? (eb(h, 0, 0, 0), (f | 0) == 3) : 0) ? (E = h + 76 | 0, D = h + 68 | 0, b[(c[D >> 2] | 0) + ((c[E >> 2] | 0) + -1 << 1) >> 1] = 0, vb(c[D >> 2] | 0, 0, (c[E >> 2] << 1) + -2 | 0) | 0, (c[h + 116 >> 2] | 0) == 0) : 0) {
                                            c[h + 108 >> 2] = 0;
                                            c[h + 92 >> 2] = 0;
                                            c[h + 5812 >> 2] = 0
                                        }
                                        Ya(e);
                                        if ((c[k >> 2] | 0) != 0) {
                                            break
                                        }
                                        c[j >> 2] = -1;
                                        E = 0;
                                        i = g;
                                        return E | 0
                                    }
                                    if ((c[k >> 2] | 0) != 0) {
                                        E = 0;
                                        i = g;
                                        return E | 0
                                    }
                                    c[j >> 2] = -1;
                                    E = 0;
                                    i = g;
                                    return E | 0
                                }
                            } while (0);
                            if ((f | 0) != 4) {
                                E = 0;
                                i = g;
                                return E | 0
                            }
                            j = h + 24 | 0;
                            k = c[j >> 2] | 0;
                            if ((k | 0) < 1) {
                                E = 1;
                                i = g;
                                return E | 0
                            }
                            f = e + 48 | 0;
                            l = c[f >> 2] | 0;
                            if ((k | 0) == 2) {
                                B = c[r >> 2] | 0;
                                c[r >> 2] = B + 1;
                                D = h + 8 | 0;
                                a[(c[D >> 2] | 0) + B >> 0] = l;
                                B = (c[f >> 2] | 0) >>> 8 & 255;
                                C = c[r >> 2] | 0;
                                c[r >> 2] = C + 1;
                                a[(c[D >> 2] | 0) + C >> 0] = B;
                                C = (c[f >> 2] | 0) >>> 16 & 255;
                                B = c[r >> 2] | 0;
                                c[r >> 2] = B + 1;
                                a[(c[D >> 2] | 0) + B >> 0] = C;
                                B = (c[f >> 2] | 0) >>> 24 & 255;
                                C = c[r >> 2] | 0;
                                c[r >> 2] = C + 1;
                                a[(c[D >> 2] | 0) + C >> 0] = B;
                                C = e + 8 | 0;
                                B = c[C >> 2] & 255;
                                E = c[r >> 2] | 0;
                                c[r >> 2] = E + 1;
                                a[(c[D >> 2] | 0) + E >> 0] = B;
                                E = (c[C >> 2] | 0) >>> 8 & 255;
                                B = c[r >> 2] | 0;
                                c[r >> 2] = B + 1;
                                a[(c[D >> 2] | 0) + B >> 0] = E;
                                B = (c[C >> 2] | 0) >>> 16 & 255;
                                E = c[r >> 2] | 0;
                                c[r >> 2] = E + 1;
                                a[(c[D >> 2] | 0) + E >> 0] = B;
                                C = (c[C >> 2] | 0) >>> 24 & 255;
                                E = c[r >> 2] | 0;
                                c[r >> 2] = E + 1;
                                a[(c[D >> 2] | 0) + E >> 0] = C
                            } else {
                                C = c[r >> 2] | 0;
                                c[r >> 2] = C + 1;
                                D = h + 8 | 0;
                                a[(c[D >> 2] | 0) + C >> 0] = l >>> 24;
                                C = c[r >> 2] | 0;
                                c[r >> 2] = C + 1;
                                a[(c[D >> 2] | 0) + C >> 0] = l >>> 16;
                                C = c[f >> 2] | 0;
                                E = c[r >> 2] | 0;
                                c[r >> 2] = E + 1;
                                a[(c[D >> 2] | 0) + E >> 0] = C >>> 8;
                                E = c[r >> 2] | 0;
                                c[r >> 2] = E + 1;
                                a[(c[D >> 2] | 0) + E >> 0] = C
                            }
                            Ya(e);
                            e = c[j >> 2] | 0;
                            if ((e | 0) > 0) {
                                c[j >> 2] = 0 - e
                            }
                            E = (c[r >> 2] | 0) == 0 & 1;
                            i = g;
                            return E | 0
                        }
                    }
                } while (0);
                c[e + 24 >> 2] = 5880;
                E = -2;
                i = g;
                return E | 0
            }
            function Ya(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0;
                b = i;
                d = c[a + 28 >> 2] | 0;
                fb(d);
                g = d + 20 | 0;
                h = c[g >> 2] | 0;
                f = a + 16 | 0;
                j = c[f >> 2] | 0;
                k = h >>> 0 > j >>> 0;
                e = k ? j : h;
                if (((k ? j : h) | 0) == 0) {
                    i = b;
                    return
                }
                k = a + 12 | 0;
                h = d + 16 | 0;
                xb(c[k >> 2] | 0, c[h >> 2] | 0, e | 0) | 0;
                c[k >> 2] = (c[k >> 2] | 0) + e;
                c[h >> 2] = (c[h >> 2] | 0) + e;
                k = a + 20 | 0;
                c[k >> 2] = (c[k >> 2] | 0) + e;
                c[f >> 2] = (c[f >> 2] | 0) - e;
                k = c[g >> 2] | 0;
                c[g >> 2] = k - e;
                if ((k | 0) != (e | 0)) {
                    i = b;
                    return
                }
                c[h >> 2] = c[d + 8 >> 2];
                i = b;
                return
            }
            function Za(a, b) {
                a = a | 0;
                b = b | 0;
                var d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                d = i;
                j = (c[a + 12 >> 2] | 0) + -5 | 0;
                j = j >>> 0 < 65535 ? j : 65535;
                m = a + 116 | 0;
                l = (b | 0) == 0;
                f = a + 108 | 0;
                e = a + 92 | 0;
                g = a + 56 | 0;
                k = a + 44 | 0;
                while (1) {
                    n = c[m >> 2] | 0;
                    if (n >>> 0 < 2) {
                        Wa(a);
                        n = c[m >> 2] | 0;
                        if ((n | 0) == 0) {
                            h = 4;
                            break
                        }
                    }
                    p = (c[f >> 2] | 0) + n | 0;
                    c[f >> 2] = p;
                    c[m >> 2] = 0;
                    n = c[e >> 2] | 0;
                    o = n + j | 0;
                    if ((p | 0) != 0) {
                        if (!(p >>> 0 < o >>> 0)) {
                            h = 7
                        }
                    } else {
                        p = 0;
                        h = 7
                    }
                    if ((h | 0) == 7) {
                        h = 0;
                        c[m >> 2] = p - o;
                        c[f >> 2] = o;
                        if ((n | 0) > -1) {
                            n = (c[g >> 2] | 0) + n | 0
                        } else {
                            n = 0
                        }
                        hb(a, n, j, 0);
                        c[e >> 2] = c[f >> 2];
                        Ya(c[a >> 2] | 0);
                        if ((c[(c[a >> 2] | 0) + 16 >> 2] | 0) == 0) {
                            a = 0;
                            h = 24;
                            break
                        }
                        p = c[f >> 2] | 0;
                        n = c[e >> 2] | 0
                    }
                    o = p - n | 0;
                    if (o >>> 0 < ((c[k >> 2] | 0) + -262 | 0) >>> 0) {
                        continue
                    }
                    if ((n | 0) > -1) {
                        n = (c[g >> 2] | 0) + n | 0
                    } else {
                        n = 0
                    }
                    hb(a, n, o, 0);
                    c[e >> 2] = c[f >> 2];
                    Ya(c[a >> 2] | 0);
                    if ((c[(c[a >> 2] | 0) + 16 >> 2] | 0) == 0) {
                        a = 0;
                        h = 24;
                        break
                    }
                }
                if ((h | 0) == 4) {
                    if (l) {
                        p = 0;
                        i = d;
                        return p | 0
                    }
                    c[a + 5812 >> 2] = 0;
                    if ((b | 0) == 4) {
                        h = c[e >> 2] | 0;
                        if (!((h | 0) > -1)) {
                            o = 0;
                            p = c[f >> 2] | 0;
                            p = p - h | 0;
                            hb(a, o, p, 1);
                            p = c[f >> 2] | 0;
                            c[e >> 2] = p;
                            p = c[a >> 2] | 0;
                            Ya(p);
                            p = c[a >> 2] | 0;
                            p = p + 16 | 0;
                            p = c[p >> 2] | 0;
                            p = (p | 0) == 0;
                            p = p ? 2 : 3;
                            i = d;
                            return p | 0
                        }
                        o = (c[g >> 2] | 0) + h | 0;
                        p = c[f >> 2] | 0;
                        p = p - h | 0;
                        hb(a, o, p, 1);
                        p = c[f >> 2] | 0;
                        c[e >> 2] = p;
                        p = c[a >> 2] | 0;
                        Ya(p);
                        p = c[a >> 2] | 0;
                        p = p + 16 | 0;
                        p = c[p >> 2] | 0;
                        p = (p | 0) == 0;
                        p = p ? 2 : 3;
                        i = d;
                        return p | 0
                    }
                    h = c[f >> 2] | 0;
                    j = c[e >> 2] | 0;
                    if ((h | 0) > (j | 0)) {
                        if ((j | 0) > -1) {
                            g = (c[g >> 2] | 0) + j | 0
                        } else {
                            g = 0
                        }
                        hb(a, g, h - j | 0, 0);
                        c[e >> 2] = c[f >> 2];
                        Ya(c[a >> 2] | 0);
                        if ((c[(c[a >> 2] | 0) + 16 >> 2] | 0) == 0) {
                            p = 0;
                            i = d;
                            return p | 0
                        }
                    }
                    p = 1;
                    i = d;
                    return p | 0
                } else if ((h | 0) == 24) {
                    i = d;
                    return a | 0
                }
                return 0
            }
            function _a(e, f) {
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0;
                g = i;
                m = e + 116 | 0;
                A = (f | 0) == 0;
                o = e + 72 | 0;
                p = e + 88 | 0;
                j = e + 108 | 0;
                k = e + 56 | 0;
                q = e + 84 | 0;
                r = e + 68 | 0;
                t = e + 52 | 0;
                s = e + 64 | 0;
                z = e + 44 | 0;
                n = e + 96 | 0;
                w = e + 112 | 0;
                l = e + 5792 | 0;
                x = e + 5796 | 0;
                y = e + 5784 | 0;
                u = e + 5788 | 0;
                v = e + 128 | 0;
                h = e + 92 | 0;
                while (1) {
                    if ((c[m >> 2] | 0) >>> 0 < 262 ? (Wa(e), B = c[m >> 2] | 0, B >>> 0 < 262) : 0) {
                        if (A) {
                            e = 0;
                            C = 34;
                            break
                        }
                        if ((B | 0) == 0) {
                            C = 25;
                            break
                        } else {
                            C = B
                        }
                        if (!(C >>> 0 > 2)) {
                            C = 10
                        } else {
                            C = 7
                        }
                    } else {
                        C = 7
                    }
                    if ((C | 0) == 7) {
                        C = 0;
                        D = c[j >> 2] | 0;
                        E = (c[o >> 2] << c[p >> 2] ^ (d[(c[k >> 2] | 0) + (D + 2) >> 0] | 0)) & c[q >> 2];
                        c[o >> 2] = E;
                        E = b[(c[r >> 2] | 0) + (E << 1) >> 1] | 0;
                        b[(c[s >> 2] | 0) + ((D & c[t >> 2]) << 1) >> 1] = E;
                        D = E & 65535;
                        b[(c[r >> 2] | 0) + (c[o >> 2] << 1) >> 1] = c[j >> 2];
                        if (!(E << 16 >> 16 == 0) ? !(((c[j >> 2] | 0) - D | 0) >>> 0 > ((c[z >> 2] | 0) + -262 | 0) >>> 0) : 0) {
                            D = ab(e, D) | 0;
                            c[n >> 2] = D
                        } else {
                            C = 10
                        }
                    }
                    if ((C | 0) == 10) {
                        D = c[n >> 2] | 0
                    }
                    do {
                        if (D >>> 0 > 2) {
                            C = D + 253 | 0;
                            E = (c[j >> 2] | 0) - (c[w >> 2] | 0) & 65535;
                            b[(c[x >> 2] | 0) + (c[l >> 2] << 1) >> 1] = E;
                            D = c[l >> 2] | 0;
                            c[l >> 2] = D + 1;
                            a[(c[y >> 2] | 0) + D >> 0] = C;
                            E = E + -1 << 16 >> 16;
                            C = e + ((d[3696 + (C & 255) >> 0] | 0 | 256) + 1 << 2) + 148 | 0;
                            b[C >> 1] = (b[C >> 1] | 0) + 1 << 16 >> 16;
                            C = E & 65535;
                            if ((E & 65535) < 256) {
                                C = a[3184 + C >> 0] | 0
                            } else {
                                C = a[(C >>> 7) + 3440 >> 0] | 0
                            }
                            D = e + ((C & 255) << 2) + 2440 | 0;
                            b[D >> 1] = (b[D >> 1] | 0) + 1 << 16 >> 16;
                            D = (c[l >> 2] | 0) == ((c[u >> 2] | 0) + -1 | 0) & 1;
                            C = c[n >> 2] | 0;
                            E = (c[m >> 2] | 0) - C | 0;
                            c[m >> 2] = E;
                            if (!(E >>> 0 > 2 ? C >>> 0 <= (c[v >> 2] | 0) >>> 0 : 0)) {
                                C = (c[j >> 2] | 0) + C | 0;
                                c[j >> 2] = C;
                                c[n >> 2] = 0;
                                E = c[k >> 2] | 0;
                                F = d[E + C >> 0] | 0;
                                c[o >> 2] = F;
                                c[o >> 2] = (F << c[p >> 2] ^ (d[E + (C + 1) >> 0] | 0)) & c[q >> 2];
                                break
                            }
                            c[n >> 2] = C + -1;
                            do {
                                E = c[j >> 2] | 0;
                                F = E + 1 | 0;
                                c[j >> 2] = F;
                                E = (c[o >> 2] << c[p >> 2] ^ (d[(c[k >> 2] | 0) + (E + 3) >> 0] | 0)) & c[q >> 2];
                                c[o >> 2] = E;
                                b[(c[s >> 2] | 0) + ((F & c[t >> 2]) << 1) >> 1] = b[(c[r >> 2] | 0) + (E << 1) >> 1] | 0;
                                b[(c[r >> 2] | 0) + (c[o >> 2] << 1) >> 1] = c[j >> 2];
                                F = (c[n >> 2] | 0) + -1 | 0;
                                c[n >> 2] = F
                            } while ((F | 0) != 0);
                            C = (c[j >> 2] | 0) + 1 | 0;
                            c[j >> 2] = C
                        } else {
                            D = a[(c[k >> 2] | 0) + (c[j >> 2] | 0) >> 0] | 0;
                            b[(c[x >> 2] | 0) + (c[l >> 2] << 1) >> 1] = 0;
                            C = c[l >> 2] | 0;
                            c[l >> 2] = C + 1;
                            a[(c[y >> 2] | 0) + C >> 0] = D;
                            D = e + ((D & 255) << 2) + 148 | 0;
                            b[D >> 1] = (b[D >> 1] | 0) + 1 << 16 >> 16;
                            D = (c[l >> 2] | 0) == ((c[u >> 2] | 0) + -1 | 0) & 1;
                            c[m >> 2] = (c[m >> 2] | 0) + -1;
                            C = (c[j >> 2] | 0) + 1 | 0;
                            c[j >> 2] = C
                        }
                    } while (0);
                    if ((D | 0) == 0) {
                        continue
                    }
                    E = c[h >> 2] | 0;
                    if ((E | 0) > -1) {
                        D = (c[k >> 2] | 0) + E | 0
                    } else {
                        D = 0
                    }
                    hb(e, D, C - E | 0, 0);
                    c[h >> 2] = c[j >> 2];
                    Ya(c[e >> 2] | 0);
                    if ((c[(c[e >> 2] | 0) + 16 >> 2] | 0) == 0) {
                        e = 0;
                        C = 34;
                        break
                    }
                }
                if ((C | 0) == 25) {
                    m = c[j >> 2] | 0;
                    c[e + 5812 >> 2] = m >>> 0 < 2 ? m : 2;
                    if ((f | 0) == 4) {
                        l = c[h >> 2] | 0;
                        if (!((l | 0) > -1)) {
                            E = 0;
                            F = m - l | 0;
                            hb(e, E, F, 1);
                            F = c[j >> 2] | 0;
                            c[h >> 2] = F;
                            F = c[e >> 2] | 0;
                            Ya(F);
                            F = c[e >> 2] | 0;
                            F = F + 16 | 0;
                            F = c[F >> 2] | 0;
                            F = (F | 0) == 0;
                            F = F ? 2 : 3;
                            i = g;
                            return F | 0
                        }
                        E = (c[k >> 2] | 0) + l | 0;
                        F = m - l | 0;
                        hb(e, E, F, 1);
                        F = c[j >> 2] | 0;
                        c[h >> 2] = F;
                        F = c[e >> 2] | 0;
                        Ya(F);
                        F = c[e >> 2] | 0;
                        F = F + 16 | 0;
                        F = c[F >> 2] | 0;
                        F = (F | 0) == 0;
                        F = F ? 2 : 3;
                        i = g;
                        return F | 0
                    }
                    if ((c[l >> 2] | 0) != 0) {
                        l = c[h >> 2] | 0;
                        if ((l | 0) > -1) {
                            k = (c[k >> 2] | 0) + l | 0
                        } else {
                            k = 0
                        }
                        hb(e, k, m - l | 0, 0);
                        c[h >> 2] = c[j >> 2];
                        Ya(c[e >> 2] | 0);
                        if ((c[(c[e >> 2] | 0) + 16 >> 2] | 0) == 0) {
                            F = 0;
                            i = g;
                            return F | 0
                        }
                    }
                    F = 1;
                    i = g;
                    return F | 0
                } else if ((C | 0) == 34) {
                    i = g;
                    return e | 0
                }
                return 0
            }
            function $a(e, f) {
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0;
                g = i;
                v = e + 116 | 0;
                z = (f | 0) == 0;
                G = e + 72 | 0;
                C = e + 88 | 0;
                j = e + 108 | 0;
                k = e + 56 | 0;
                p = e + 84 | 0;
                q = e + 68 | 0;
                s = e + 52 | 0;
                r = e + 64 | 0;
                x = e + 96 | 0;
                t = e + 120 | 0;
                y = e + 112 | 0;
                w = e + 100 | 0;
                l = e + 5792 | 0;
                E = e + 5796 | 0;
                D = e + 5784 | 0;
                u = e + 5788 | 0;
                o = e + 104 | 0;
                h = e + 92 | 0;
                B = e + 128 | 0;
                n = e + 44 | 0;
                A = e + 136 | 0;
                a: while (1) {
                    H = c[v >> 2] | 0;
                    while (1) {
                        if (H >>> 0 < 262 ? (Wa(e), F = c[v >> 2] | 0, F >>> 0 < 262) : 0) {
                            if (z) {
                                e = 0;
                                m = 47;
                                break a
                            }
                            if ((F | 0) == 0) {
                                m = 36;
                                break a
                            } else {
                                H = F
                            }
                            if (!(H >>> 0 > 2)) {
                                c[t >> 2] = c[x >> 2];
                                c[w >> 2] = c[y >> 2];
                                c[x >> 2] = 2;
                                H = 2
                            } else {
                                m = 9
                            }
                        } else {
                            m = 9
                        }
                        do {
                            if ((m | 0) == 9) {
                                m = 0;
                                L = c[j >> 2] | 0;
                                H = (c[G >> 2] << c[C >> 2] ^ (d[(c[k >> 2] | 0) + (L + 2) >> 0] | 0)) & c[p >> 2];
                                c[G >> 2] = H;
                                H = b[(c[q >> 2] | 0) + (H << 1) >> 1] | 0;
                                b[(c[r >> 2] | 0) + ((L & c[s >> 2]) << 1) >> 1] = H;
                                H = H & 65535;
                                b[(c[q >> 2] | 0) + (c[G >> 2] << 1) >> 1] = c[j >> 2];
                                L = c[x >> 2] | 0;
                                c[t >> 2] = L;
                                c[w >> 2] = c[y >> 2];
                                c[x >> 2] = 2;
                                if (((H | 0) != 0 ? L >>> 0 < (c[B >> 2] | 0) >>> 0 : 0) ? !(((c[j >> 2] | 0) - H | 0) >>> 0 > ((c[n >> 2] | 0) + -262 | 0) >>> 0) : 0) {
                                    H = ab(e, H) | 0;
                                    c[x >> 2] = H;
                                    if (H >>> 0 < 6) {
                                        if ((c[A >> 2] | 0) != 1) {
                                            if ((H | 0) != 3) {
                                                break
                                            }
                                            if (!(((c[j >> 2] | 0) - (c[y >> 2] | 0) | 0) >>> 0 > 4096)) {
                                                H = 3;
                                                break
                                            }
                                        }
                                        c[x >> 2] = 2;
                                        H = 2
                                    }
                                } else {
                                    H = 2
                                }
                            }
                        } while (0);
                        I = c[t >> 2] | 0;
                        if (!(I >>> 0 <= 2 | H >>> 0 > I >>> 0)) {
                            break
                        }
                        if ((c[o >> 2] | 0) == 0) {
                            c[o >> 2] = 1;
                            c[j >> 2] = (c[j >> 2] | 0) + 1;
                            H = (c[v >> 2] | 0) + -1 | 0;
                            c[v >> 2] = H;
                            continue
                        }
                        L = a[(c[k >> 2] | 0) + ((c[j >> 2] | 0) + -1) >> 0] | 0;
                        b[(c[E >> 2] | 0) + (c[l >> 2] << 1) >> 1] = 0;
                        K = c[l >> 2] | 0;
                        c[l >> 2] = K + 1;
                        a[(c[D >> 2] | 0) + K >> 0] = L;
                        L = e + ((L & 255) << 2) + 148 | 0;
                        b[L >> 1] = (b[L >> 1] | 0) + 1 << 16 >> 16;
                        if ((c[l >> 2] | 0) == ((c[u >> 2] | 0) + -1 | 0)) {
                            I = c[h >> 2] | 0;
                            if ((I | 0) > -1) {
                                H = (c[k >> 2] | 0) + I | 0
                            } else {
                                H = 0
                            }
                            hb(e, H, (c[j >> 2] | 0) - I | 0, 0);
                            c[h >> 2] = c[j >> 2];
                            Ya(c[e >> 2] | 0)
                        }
                        c[j >> 2] = (c[j >> 2] | 0) + 1;
                        H = (c[v >> 2] | 0) + -1 | 0;
                        c[v >> 2] = H;
                        if ((c[(c[e >> 2] | 0) + 16 >> 2] | 0) == 0) {
                            e = 0;
                            m = 47;
                            break a
                        }
                    }
                    L = c[j >> 2] | 0;
                    H = L + (c[v >> 2] | 0) + -3 | 0;
                    I = I + 253 | 0;
                    L = L + 65535 - (c[w >> 2] | 0) & 65535;
                    b[(c[E >> 2] | 0) + (c[l >> 2] << 1) >> 1] = L;
                    K = c[l >> 2] | 0;
                    c[l >> 2] = K + 1;
                    a[(c[D >> 2] | 0) + K >> 0] = I;
                    L = L + -1 << 16 >> 16;
                    I = e + ((d[3696 + (I & 255) >> 0] | 0 | 256) + 1 << 2) + 148 | 0;
                    b[I >> 1] = (b[I >> 1] | 0) + 1 << 16 >> 16;
                    I = L & 65535;
                    if ((L & 65535) < 256) {
                        I = a[3184 + I >> 0] | 0
                    } else {
                        I = a[(I >>> 7) + 3440 >> 0] | 0
                    }
                    I = e + ((I & 255) << 2) + 2440 | 0;
                    b[I >> 1] = (b[I >> 1] | 0) + 1 << 16 >> 16;
                    I = (c[l >> 2] | 0) == ((c[u >> 2] | 0) + -1 | 0);
                    K = c[t >> 2] | 0;
                    c[v >> 2] = (c[v >> 2] | 0) - (K + -1);
                    K = K + -2 | 0;
                    c[t >> 2] = K;
                    do {
                        J = c[j >> 2] | 0;
                        L = J + 1 | 0;
                        c[j >> 2] = L;
                        if (!(L >>> 0 > H >>> 0)) {
                            K = (c[G >> 2] << c[C >> 2] ^ (d[(c[k >> 2] | 0) + (J + 3) >> 0] | 0)) & c[p >> 2];
                            c[G >> 2] = K;
                            b[(c[r >> 2] | 0) + ((L & c[s >> 2]) << 1) >> 1] = b[(c[q >> 2] | 0) + (K << 1) >> 1] | 0;
                            b[(c[q >> 2] | 0) + (c[G >> 2] << 1) >> 1] = c[j >> 2];
                            K = c[t >> 2] | 0
                        }
                        K = K + -1 | 0;
                        c[t >> 2] = K
                    } while ((K | 0) != 0);
                    c[o >> 2] = 0;
                    c[x >> 2] = 2;
                    H = (c[j >> 2] | 0) + 1 | 0;
                    c[j >> 2] = H;
                    if (!I) {
                        continue
                    }
                    J = c[h >> 2] | 0;
                    if ((J | 0) > -1) {
                        I = (c[k >> 2] | 0) + J | 0
                    } else {
                        I = 0
                    }
                    hb(e, I, H - J | 0, 0);
                    c[h >> 2] = c[j >> 2];
                    Ya(c[e >> 2] | 0);
                    if ((c[(c[e >> 2] | 0) + 16 >> 2] | 0) == 0) {
                        e = 0;
                        m = 47;
                        break
                    }
                }
                if ((m | 0) == 36) {
                    if ((c[o >> 2] | 0) != 0) {
                        L = a[(c[k >> 2] | 0) + ((c[j >> 2] | 0) + -1) >> 0] | 0;
                        b[(c[E >> 2] | 0) + (c[l >> 2] << 1) >> 1] = 0;
                        K = c[l >> 2] | 0;
                        c[l >> 2] = K + 1;
                        a[(c[D >> 2] | 0) + K >> 0] = L;
                        L = e + ((L & 255) << 2) + 148 | 0;
                        b[L >> 1] = (b[L >> 1] | 0) + 1 << 16 >> 16;
                        c[o >> 2] = 0
                    }
                    m = c[j >> 2] | 0;
                    c[e + 5812 >> 2] = m >>> 0 < 2 ? m : 2;
                    if ((f | 0) == 4) {
                        l = c[h >> 2] | 0;
                        if (!((l | 0) > -1)) {
                            K = 0;
                            L = m - l | 0;
                            hb(e, K, L, 1);
                            L = c[j >> 2] | 0;
                            c[h >> 2] = L;
                            L = c[e >> 2] | 0;
                            Ya(L);
                            L = c[e >> 2] | 0;
                            L = L + 16 | 0;
                            L = c[L >> 2] | 0;
                            L = (L | 0) == 0;
                            L = L ? 2 : 3;
                            i = g;
                            return L | 0
                        }
                        K = (c[k >> 2] | 0) + l | 0;
                        L = m - l | 0;
                        hb(e, K, L, 1);
                        L = c[j >> 2] | 0;
                        c[h >> 2] = L;
                        L = c[e >> 2] | 0;
                        Ya(L);
                        L = c[e >> 2] | 0;
                        L = L + 16 | 0;
                        L = c[L >> 2] | 0;
                        L = (L | 0) == 0;
                        L = L ? 2 : 3;
                        i = g;
                        return L | 0
                    }
                    if ((c[l >> 2] | 0) != 0) {
                        l = c[h >> 2] | 0;
                        if ((l | 0) > -1) {
                            k = (c[k >> 2] | 0) + l | 0
                        } else {
                            k = 0
                        }
                        hb(e, k, m - l | 0, 0);
                        c[h >> 2] = c[j >> 2];
                        Ya(c[e >> 2] | 0);
                        if ((c[(c[e >> 2] | 0) + 16 >> 2] | 0) == 0) {
                            L = 0;
                            i = g;
                            return L | 0
                        }
                    }
                    L = 1;
                    i = g;
                    return L | 0
                } else if ((m | 0) == 47) {
                    i = g;
                    return e | 0
                }
                return 0
            }
            function ab(b, d) {
                b = b | 0;
                d = d | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0;
                f = i;
                w = c[b + 124 >> 2] | 0;
                h = c[b + 56 >> 2] | 0;
                j = c[b + 108 >> 2] | 0;
                t = c[b + 120 >> 2] | 0;
                l = c[b + 144 >> 2] | 0;
                p = (c[b + 44 >> 2] | 0) + -262 | 0;
                p = j >>> 0 > p >>> 0 ? j - p | 0 : 0;
                q = c[b + 64 >> 2] | 0;
                o = c[b + 52 >> 2] | 0;
                r = h + (j + 258) | 0;
                g = c[b + 116 >> 2] | 0;
                l = l >>> 0 > g >>> 0 ? g : l;
                k = b + 112 | 0;
                m = r;
                n = h + j | 0;
                s = t;
                b = t >>> 0 < (c[b + 140 >> 2] | 0) >>> 0 ? w : w >>> 2;
                w = h + j | 0;
                u = a[h + (j + t) >> 0] | 0;
                t = a[h + (j + (t + -1)) >> 0] | 0;
                while (1) {
                    x = h + d | 0;
                    if ((((a[h + (d + s) >> 0] | 0) == u << 24 >> 24 ? (a[h + (d + (s + -1)) >> 0] | 0) == t << 24 >> 24 : 0) ? (a[x >> 0] | 0) == (a[w >> 0] | 0) : 0) ? (a[h + (d + 1) >> 0] | 0) == (a[w + 1 >> 0] | 0) : 0) {
                        v = h + (d + 2) | 0;
                        w = w + 2 | 0;
                        do {
                            x = w + 1 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 1 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 2 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 2 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 3 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 3 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 4 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 4 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 5 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 5 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 6 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 6 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            x = w + 7 | 0;
                            if ((a[x >> 0] | 0) != (a[v + 7 >> 0] | 0)) {
                                w = x;
                                break
                            }
                            w = w + 8 | 0;
                            v = v + 8 | 0
                        } while (w >>> 0 < r >>> 0 ? (a[w >> 0] | 0) == (a[v >> 0] | 0) : 0);
                        w = w - m | 0;
                        x = w + 258 | 0;
                        if ((x | 0) > (s | 0)) {
                            c[k >> 2] = d;
                            if ((x | 0) >= (l | 0)) {
                                s = x;
                                h = 20;
                                break
                            }
                            s = x;
                            v = n;
                            u = a[h + (j + x) >> 0] | 0;
                            t = a[h + (j + (w + 257)) >> 0] | 0
                        } else {
                            v = n
                        }
                    } else {
                        v = w
                    }
                    d = e[q + ((d & o) << 1) >> 1] | 0;
                    if (!(d >>> 0 > p >>> 0)) {
                        h = 20;
                        break
                    }
                    b = b + -1 | 0;
                    if ((b | 0) == 0) {
                        h = 20;
                        break
                    } else {
                        w = v
                    }
                }
                if ((h | 0) == 20) {
                    i = f;
                    return (s >>> 0 > g >>> 0 ? g : s) | 0
                }
                return 0
            }
            function bb(f) {
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0, J = 0, K = 0, L = 0, M = 0, N = 0, O = 0, P = 0, Q = 0, R = 0, S = 0, T = 0, U = 0, V = 0, W = 0, X = 0, Y = 0, Z = 0, _ = 0, $ = 0, aa = 0, ba = 0, ca = 0, da = 0, ea = 0, fa = 0, ga = 0, ha = 0, ia = 0, ja = 0, ka = 0, la = 0, ma = 0, na = 0, oa = 0, pa = 0, qa = 0, ra = 0, sa = 0, ta = 0, ua = 0, va = 0, wa = 0, xa = 0, ya = 0, za = 0, Aa = 0, Ba = 0, Ca = 0, Da = 0, Ea = 0, Fa = 0, Ga = 0, Ia = 0, Ja = 0, Ka = 0, La = 0;
                g = i;
                i = i + 16 | 0;
                D = g;
                if ((f | 0) == 0) {
                    La = -2;
                    i = g;
                    return La | 0
                }
                v = f + 28 | 0;
                A = c[v >> 2] | 0;
                if ((A | 0) == 0) {
                    La = -2;
                    i = g;
                    return La | 0
                }
                k = f + 12 | 0;
                ka = c[k >> 2] | 0;
                if ((ka | 0) == 0) {
                    La = -2;
                    i = g;
                    return La | 0
                }
                ma = c[f >> 2] | 0;
                if ((ma | 0) == 0 ? (c[f + 4 >> 2] | 0) != 0 : 0) {
                    La = -2;
                    i = g;
                    return La | 0
                }
                ra = c[A >> 2] | 0;
                if ((ra | 0) == 11) {
                    c[A >> 2] = 12;
                    h = A;
                    ra = 12;
                    ma = c[f >> 2] | 0;
                    ka = c[k >> 2] | 0
                } else {
                    h = A
                }
                u = f + 16 | 0;
                ha = c[u >> 2] | 0;
                t = f + 4 | 0;
                j = c[t >> 2] | 0;
                x = A + 56 | 0;
                l = A + 60 | 0;
                s = A + 8 | 0;
                p = A + 16 | 0;
                G = A + 32 | 0;
                J = f + 24 | 0;
                L = A + 36 | 0;
                K = A + 20 | 0;
                o = A + 24 | 0;
                n = f + 48 | 0;
                I = D + 1 | 0;
                Q = D + 2 | 0;
                R = D + 3 | 0;
                Z = A + 64 | 0;
                S = A + 12 | 0;
                m = A + 4 | 0;
                T = A + 76 | 0;
                U = A + 84 | 0;
                V = A + 80 | 0;
                W = A + 88 | 0;
                ga = A + 96 | 0;
                O = A + 100 | 0;
                P = A + 92 | 0;
                M = A + 104 | 0;
                aa = A + 7108 | 0;
                H = A + 72 | 0;
                fa = A + 7112 | 0;
                ea = A + 68 | 0;
                ba = A + 44 | 0;
                N = A + 7104 | 0;
                ca = A + 48 | 0;
                da = A + 52 | 0;
                w = A + 40 | 0;
                q = f + 20 | 0;
                r = A + 28 | 0;
                X = A + 1328 | 0;
                Y = A + 108 | 0;
                F = A + 112 | 0;
                _ = A + 752 | 0;
                $ = A + 624 | 0;
                na = c[l >> 2] | 0;
                pa = j;
                oa = c[x >> 2] | 0;
                ja = ha;
                la = 0;
                a: while (1) {
                    b: do {
                        switch (ra | 0) {
                            case 6:
                                {
                                    qa = c[p >> 2] | 0;
                                    ia = 81;
                                    break
                                }
                                ;
                            case 21:
                                {
                                    qa = c[H >> 2] | 0;
                                    ia = 286;
                                    break
                                }
                                ;
                            case 23:
                                {
                                    qa = c[H >> 2] | 0;
                                    ia = 307;
                                    break
                                }
                                ;
                            case 0:
                                {
                                    qa = c[s >> 2] | 0;
                                    if ((qa | 0) == 0) {
                                        c[h >> 2] = 12;
                                        qa = ja;
                                        break b
                                    }
                                    while (1) {
                                        if (!(na >>> 0 < 16)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    if ((qa & 2 | 0) != 0 & (oa | 0) == 35615) {
                                        c[o >> 2] = 0;
                                        a[D >> 0] = 31;
                                        a[I >> 0] = -117;
                                        c[o >> 2] = rb(c[o >> 2] | 0, D, 2) | 0;
                                        c[h >> 2] = 1;
                                        na = 0;
                                        oa = 0;
                                        qa = ja;
                                        break b
                                    }
                                    c[p >> 2] = 0;
                                    ra = c[G >> 2] | 0;
                                    if ((ra | 0) != 0) {
                                        c[ra + 48 >> 2] = -1;
                                        qa = c[s >> 2] | 0
                                    }
                                    if ((qa & 1 | 0) != 0 ? ((((oa << 8 & 65280) + (oa >>> 8) | 0) >>> 0) % 31 | 0 | 0) == 0 : 0) {
                                        if ((oa & 15 | 0) != 8) {
                                            c[J >> 2] = 336;
                                            c[h >> 2] = 29;
                                            qa = ja;
                                            break b
                                        }
                                        qa = oa >>> 4;
                                        na = na + -4 | 0;
                                        ra = (qa & 15) + 8 | 0;
                                        sa = c[L >> 2] | 0;
                                        if ((sa | 0) != 0) {
                                            if (ra >>> 0 > sa >>> 0) {
                                                c[J >> 2] = 368;
                                                c[h >> 2] = 29;
                                                oa = qa;
                                                qa = ja;
                                                break b
                                            }
                                        } else {
                                            c[L >> 2] = ra
                                        }
                                        c[K >> 2] = 1 << ra;
                                        na = qb(0, 0, 0) | 0;
                                        c[o >> 2] = na;
                                        c[n >> 2] = na;
                                        c[h >> 2] = oa >>> 12 & 2 ^ 11;
                                        na = 0;
                                        oa = 0;
                                        qa = ja;
                                        break b
                                    }
                                    c[J >> 2] = 312;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                                ;
                            case 1:
                                {
                                    while (1) {
                                        if (!(na >>> 0 < 16)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        oa = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        ma = ma + 1 | 0
                                    }
                                    c[p >> 2] = oa;
                                    if ((oa & 255 | 0) != 8) {
                                        c[J >> 2] = 336;
                                        c[h >> 2] = 29;
                                        qa = ja;
                                        break b
                                    }
                                    if ((oa & 57344 | 0) != 0) {
                                        c[J >> 2] = 392;
                                        c[h >> 2] = 29;
                                        qa = ja;
                                        break b
                                    }
                                    ia = c[G >> 2] | 0;
                                    if ((ia | 0) == 0) {
                                        ia = oa
                                    } else {
                                        c[ia >> 2] = oa >>> 8 & 1;
                                        ia = c[p >> 2] | 0
                                    }
                                    if ((ia & 512 | 0) != 0) {
                                        a[D >> 0] = oa;
                                        a[I >> 0] = oa >>> 8;
                                        c[o >> 2] = rb(c[o >> 2] | 0, D, 2) | 0
                                    }
                                    c[h >> 2] = 2;
                                    na = 0;
                                    oa = 0;
                                    ia = 44;
                                    break
                                }
                                ;
                            case 2:
                                {
                                    ia = 44;
                                    break
                                }
                                ;
                            case 3:
                                {
                                    ia = 52;
                                    break
                                }
                                ;
                            case 4:
                                {
                                    ia = 60;
                                    break
                                }
                                ;
                            case 5:
                                {
                                    ia = 71;
                                    break
                                }
                                ;
                            case 7:
                                {
                                    ia = 94;
                                    break
                                }
                                ;
                            case 8:
                                {
                                    ia = 107;
                                    break
                                }
                                ;
                            case 9:
                                {
                                    while (1) {
                                        if (!(na >>> 0 < 32)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    na = yb(oa | 0) | 0;
                                    c[o >> 2] = na;
                                    c[n >> 2] = na;
                                    c[h >> 2] = 10;
                                    na = 0;
                                    oa = 0;
                                    ia = 120;
                                    break
                                }
                                ;
                            case 10:
                                {
                                    ia = 120;
                                    break
                                }
                                ;
                            case 12:
                            case 11:
                                {
                                    qa = na;
                                    ia = 123;
                                    break
                                }
                                ;
                            case 13:
                                {
                                    qa = na & -8;
                                    oa = oa >>> (na & 7);
                                    while (1) {
                                        if (!(qa >>> 0 < 32)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            na = qa;
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << qa) | 0;
                                        qa = qa + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    na = oa & 65535;
                                    if ((na | 0) == (oa >>> 16 ^ 65535 | 0)) {
                                        c[Z >> 2] = na;
                                        c[h >> 2] = 14;
                                        na = 0;
                                        oa = 0;
                                        ia = 141;
                                        break b
                                    } else {
                                        c[J >> 2] = 472;
                                        c[h >> 2] = 29;
                                        na = qa;
                                        qa = ja;
                                        break b
                                    }
                                }
                                ;
                            case 14:
                                {
                                    ia = 141;
                                    break
                                }
                                ;
                            case 15:
                                {
                                    ia = 142;
                                    break
                                }
                                ;
                            case 16:
                                {
                                    while (1) {
                                        if (!(na >>> 0 < 14)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    Ka = (oa & 31) + 257 | 0;
                                    c[ga >> 2] = Ka;
                                    La = (oa >>> 5 & 31) + 1 | 0;
                                    c[O >> 2] = La;
                                    c[P >> 2] = (oa >>> 10 & 15) + 4;
                                    oa = oa >>> 14;
                                    na = na + -14 | 0;
                                    if (Ka >>> 0 > 286 | La >>> 0 > 30) {
                                        c[J >> 2] = 504;
                                        c[h >> 2] = 29;
                                        qa = ja;
                                        break b
                                    } else {
                                        c[M >> 2] = 0;
                                        c[h >> 2] = 17;
                                        ia = 152;
                                        break b
                                    }
                                }
                                ;
                            case 17:
                                {
                                    ia = 152;
                                    break
                                }
                                ;
                            case 18:
                                {
                                    ia = 162;
                                    break
                                }
                                ;
                            case 19:
                                {
                                    ia = 200;
                                    break
                                }
                                ;
                            case 20:
                                {
                                    ia = 201;
                                    break
                                }
                                ;
                            case 22:
                                {
                                    ia = 293;
                                    break
                                }
                                ;
                            case 24:
                                {
                                    ia = 313;
                                    break
                                }
                                ;
                            case 25:
                                {
                                    if ((ja | 0) == 0) {
                                        break a
                                    }
                                    a[ka >> 0] = c[Z >> 2];
                                    c[h >> 2] = 20;
                                    qa = ja + -1 | 0;
                                    ka = ka + 1 | 0;
                                    break
                                }
                                ;
                            case 26:
                                {
                                    if ((c[s >> 2] | 0) != 0) {
                                        while (1) {
                                            if (!(na >>> 0 < 32)) {
                                                break
                                            }
                                            if ((pa | 0) == 0) {
                                                pa = 0;
                                                break a
                                            }
                                            La = oa + (d[ma >> 0] << na) | 0;
                                            na = na + 8 | 0;
                                            pa = pa + -1 | 0;
                                            oa = La;
                                            ma = ma + 1 | 0
                                        }
                                        qa = ha - ja | 0;
                                        c[q >> 2] = (c[q >> 2] | 0) + qa;
                                        c[r >> 2] = (c[r >> 2] | 0) + qa;
                                        if ((ha | 0) != (ja | 0)) {
                                            ha = c[o >> 2] | 0;
                                            ra = ka + (0 - qa) | 0;
                                            if ((c[p >> 2] | 0) == 0) {
                                                ha = qb(ha, ra, qa) | 0
                                            } else {
                                                ha = rb(ha, ra, qa) | 0
                                            }
                                            c[o >> 2] = ha;
                                            c[n >> 2] = ha
                                        }
                                        if ((c[p >> 2] | 0) == 0) {
                                            ha = yb(oa | 0) | 0
                                        } else {
                                            ha = oa
                                        }
                                        if ((ha | 0) == (c[o >> 2] | 0)) {
                                            na = 0;
                                            oa = 0;
                                            ha = ja
                                        } else {
                                            c[J >> 2] = 704;
                                            c[h >> 2] = 29;
                                            qa = ja;
                                            ha = ja;
                                            break b
                                        }
                                    }
                                    c[h >> 2] = 27;
                                    ia = 344;
                                    break
                                }
                                ;
                            case 27:
                                {
                                    ia = 344;
                                    break
                                }
                                ;
                            case 29:
                                {
                                    ia = 352;
                                    break a
                                }
                                ;
                            case 28:
                                {
                                    la = 1;
                                    break a
                                }
                                ;
                            case 30:
                                {
                                    f = -4;
                                    ia = 377;
                                    break a
                                }
                                ;
                            default:
                                {
                                    ia = 353;
                                    break a
                                }
                        }
                    } while (0);
                    do {
                        if ((ia | 0) == 44) {
                            while (1) {
                                ia = 0;
                                if (!(na >>> 0 < 32)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                ia = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = ia;
                                ma = ma + 1 | 0;
                                ia = 44
                            }
                            ia = c[G >> 2] | 0;
                            if ((ia | 0) != 0) {
                                c[ia + 4 >> 2] = oa
                            }
                            if ((c[p >> 2] & 512 | 0) != 0) {
                                a[D >> 0] = oa;
                                a[I >> 0] = oa >>> 8;
                                a[Q >> 0] = oa >>> 16;
                                a[R >> 0] = oa >>> 24;
                                c[o >> 2] = rb(c[o >> 2] | 0, D, 4) | 0
                            }
                            c[h >> 2] = 3;
                            na = 0;
                            oa = 0;
                            ia = 52
                        } else if ((ia | 0) == 120) {
                            if ((c[S >> 2] | 0) == 0) {
                                ia = 121;
                                break a
                            }
                            qa = qb(0, 0, 0) | 0;
                            c[o >> 2] = qa;
                            c[n >> 2] = qa;
                            c[h >> 2] = 11;
                            qa = na;
                            ia = 123
                        } else if ((ia | 0) == 141) {
                            c[h >> 2] = 15;
                            ia = 142
                        } else if ((ia | 0) == 152) {
                            while (1) {
                                ia = 0;
                                qa = c[M >> 2] | 0;
                                if (!(qa >>> 0 < (c[P >> 2] | 0) >>> 0)) {
                                    break
                                }
                                while (1) {
                                    if (!(na >>> 0 < 3)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                c[M >> 2] = qa + 1;
                                b[A + (e[272 + (qa << 1) >> 1] << 1) + 112 >> 1] = oa & 7;
                                na = na + -3 | 0;
                                oa = oa >>> 3;
                                ia = 152
                            }
                            while (1) {
                                if (!(qa >>> 0 < 19)) {
                                    break
                                }
                                c[M >> 2] = qa + 1;
                                b[A + (e[272 + (qa << 1) >> 1] << 1) + 112 >> 1] = 0;
                                qa = c[M >> 2] | 0
                            }
                            c[Y >> 2] = X;
                            c[T >> 2] = X;
                            c[U >> 2] = 7;
                            la = cb(0, F, 19, Y, U, _) | 0;
                            if ((la | 0) == 0) {
                                c[M >> 2] = 0;
                                c[h >> 2] = 18;
                                la = 0;
                                ia = 162;
                                break
                            } else {
                                c[J >> 2] = 544;
                                c[h >> 2] = 29;
                                qa = ja;
                                break
                            }
                        } else if ((ia | 0) == 344) {
                            ia = 0;
                            if ((c[s >> 2] | 0) == 0) {
                                ia = 351;
                                break a
                            }
                            if ((c[p >> 2] | 0) == 0) {
                                ia = 351;
                                break a
                            }
                            while (1) {
                                if (!(na >>> 0 < 32)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                La = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = La;
                                ma = ma + 1 | 0
                            }
                            if ((oa | 0) == (c[r >> 2] | 0)) {
                                na = 0;
                                oa = 0;
                                ia = 351;
                                break a
                            }
                            c[J >> 2] = 728;
                            c[h >> 2] = 29;
                            qa = ja
                        }
                    } while (0);
                    do {
                        if ((ia | 0) == 52) {
                            while (1) {
                                ia = 0;
                                if (!(na >>> 0 < 16)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                ia = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = ia;
                                ma = ma + 1 | 0;
                                ia = 52
                            }
                            ia = c[G >> 2] | 0;
                            if ((ia | 0) != 0) {
                                c[ia + 8 >> 2] = oa & 255;
                                c[(c[G >> 2] | 0) + 12 >> 2] = oa >>> 8
                            }
                            if ((c[p >> 2] & 512 | 0) != 0) {
                                a[D >> 0] = oa;
                                a[I >> 0] = oa >>> 8;
                                c[o >> 2] = rb(c[o >> 2] | 0, D, 2) | 0
                            }
                            c[h >> 2] = 4;
                            na = 0;
                            oa = 0;
                            ia = 60
                        } else if ((ia | 0) == 123) {
                            ia = 0;
                            if ((c[m >> 2] | 0) == 0) {
                                na = qa
                            } else {
                                c[h >> 2] = 26;
                                na = qa & -8;
                                oa = oa >>> (qa & 7);
                                qa = ja;
                                break
                            }
                            while (1) {
                                if (!(na >>> 0 < 3)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                La = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = La;
                                ma = ma + 1 | 0
                            }
                            c[m >> 2] = oa & 1;
                            qa = oa >>> 1 & 3;
                            if ((qa | 0) == 0) {
                                c[h >> 2] = 13
                            } else if ((qa | 0) == 1) {
                                c[T >> 2] = 752;
                                c[U >> 2] = 9;
                                c[V >> 2] = 2800;
                                c[W >> 2] = 5;
                                c[h >> 2] = 19
                            } else if ((qa | 0) == 2) {
                                c[h >> 2] = 16
                            } else if ((qa | 0) == 3) {
                                c[J >> 2] = 448;
                                c[h >> 2] = 29
                            }
                            na = na + -3 | 0;
                            oa = oa >>> 3;
                            qa = ja
                        } else if ((ia | 0) == 142) {
                            ia = 0;
                            qa = c[Z >> 2] | 0;
                            if ((qa | 0) == 0) {
                                c[h >> 2] = 11;
                                qa = ja;
                                break
                            }
                            ra = qa >>> 0 > pa >>> 0 ? pa : qa;
                            ra = ra >>> 0 > ja >>> 0 ? ja : ra;
                            if ((ra | 0) == 0) {
                                break a
                            }
                            xb(ka | 0, ma | 0, ra | 0) | 0;
                            c[Z >> 2] = (c[Z >> 2] | 0) - ra;
                            pa = pa - ra | 0;
                            qa = ja - ra | 0;
                            ma = ma + ra | 0;
                            ka = ka + ra | 0
                        } else if ((ia | 0) == 162) {
                            ia = 0;
                            c: while (1) {
                                qa = c[M >> 2] | 0;
                                ra = (c[ga >> 2] | 0) + (c[O >> 2] | 0) | 0;
                                if (!(qa >>> 0 < ra >>> 0)) {
                                    ia = 192;
                                    break
                                }
                                ta = (1 << c[U >> 2]) + -1 | 0;
                                ua = c[T >> 2] | 0;
                                while (1) {
                                    va = ua + ((oa & ta) << 2) | 0;
                                    va = e[va >> 1] | e[va + 2 >> 1] << 16;
                                    sa = va >>> 8 & 255;
                                    if (!(sa >>> 0 > na >>> 0)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                ta = va >>> 16 & 65535;
                                if ((ta & 65535) < 16) {
                                    c[M >> 2] = qa + 1;
                                    b[A + (qa << 1) + 112 >> 1] = ta;
                                    na = na - sa | 0;
                                    oa = oa >>> sa;
                                    continue
                                }
                                if (ta << 16 >> 16 == 16) {
                                    ta = sa + 2 | 0;
                                    while (1) {
                                        if (!(na >>> 0 < ta >>> 0)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    oa = oa >>> sa;
                                    na = na - sa | 0;
                                    if ((qa | 0) == 0) {
                                        ia = 176;
                                        break
                                    }
                                    na = na + -2 | 0;
                                    sa = (oa & 3) + 3 | 0;
                                    oa = oa >>> 2;
                                    ta = b[A + (qa + -1 << 1) + 112 >> 1] | 0
                                } else if (ta << 16 >> 16 == 17) {
                                    ta = sa + 3 | 0;
                                    while (1) {
                                        if (!(na >>> 0 < ta >>> 0)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    oa = oa >>> sa;
                                    na = na - sa + -3 | 0;
                                    sa = (oa & 7) + 3 | 0;
                                    oa = oa >>> 3;
                                    ta = 0
                                } else {
                                    ta = sa + 7 | 0;
                                    while (1) {
                                        if (!(na >>> 0 < ta >>> 0)) {
                                            break
                                        }
                                        if ((pa | 0) == 0) {
                                            pa = 0;
                                            break a
                                        }
                                        La = oa + (d[ma >> 0] << na) | 0;
                                        na = na + 8 | 0;
                                        pa = pa + -1 | 0;
                                        oa = La;
                                        ma = ma + 1 | 0
                                    }
                                    oa = oa >>> sa;
                                    na = na - sa + -7 | 0;
                                    sa = (oa & 127) + 11 | 0;
                                    oa = oa >>> 7;
                                    ta = 0
                                }
                                if ((qa + sa | 0) >>> 0 > ra >>> 0) {
                                    ia = 189;
                                    break
                                }
                                while (1) {
                                    if ((sa | 0) == 0) {
                                        continue c
                                    }
                                    La = c[M >> 2] | 0;
                                    c[M >> 2] = La + 1;
                                    b[A + (La << 1) + 112 >> 1] = ta;
                                    sa = sa + -1 | 0
                                }
                            }
                            if ((ia | 0) == 176) {
                                ia = 0;
                                c[J >> 2] = 576;
                                c[h >> 2] = 29;
                                qa = ja;
                                break
                            } else if ((ia | 0) == 189) {
                                ia = 0;
                                c[J >> 2] = 576;
                                c[h >> 2] = 29;
                                qa = ja;
                                break
                            } else if ((ia | 0) == 192) {
                                ia = 0;
                                if ((c[h >> 2] | 0) == 29) {
                                    qa = ja;
                                    break
                                }
                                if ((b[$ >> 1] | 0) == 0) {
                                    c[J >> 2] = 608;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                                c[Y >> 2] = X;
                                c[T >> 2] = X;
                                c[U >> 2] = 9;
                                la = cb(1, F, c[ga >> 2] | 0, Y, U, _) | 0;
                                if ((la | 0) != 0) {
                                    c[J >> 2] = 648;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                                c[V >> 2] = c[Y >> 2];
                                c[W >> 2] = 6;
                                la = cb(2, A + (c[ga >> 2] << 1) + 112 | 0, c[O >> 2] | 0, Y, W, _) | 0;
                                if ((la | 0) == 0) {
                                    c[h >> 2] = 19;
                                    la = 0;
                                    ia = 200;
                                    break
                                } else {
                                    c[J >> 2] = 680;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                            }
                        }
                    } while (0);
                    if ((ia | 0) == 60) {
                        ia = 0;
                        qa = c[p >> 2] | 0;
                        if ((qa & 1024 | 0) == 0) {
                            ia = c[G >> 2] | 0;
                            if ((ia | 0) != 0) {
                                c[ia + 16 >> 2] = 0
                            }
                        } else {
                            while (1) {
                                if (!(na >>> 0 < 16)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                La = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = La;
                                ma = ma + 1 | 0
                            }
                            c[Z >> 2] = oa;
                            ia = c[G >> 2] | 0;
                            if ((ia | 0) != 0) {
                                c[ia + 20 >> 2] = oa;
                                qa = c[p >> 2] | 0
                            }
                            if ((qa & 512 | 0) == 0) {
                                na = 0;
                                oa = 0
                            } else {
                                a[D >> 0] = oa;
                                a[I >> 0] = oa >>> 8;
                                c[o >> 2] = rb(c[o >> 2] | 0, D, 2) | 0;
                                na = 0;
                                oa = 0
                            }
                        }
                        c[h >> 2] = 5;
                        ia = 71
                    } else if ((ia | 0) == 200) {
                        c[h >> 2] = 20;
                        ia = 201
                    }
                    do {
                        if ((ia | 0) == 71) {
                            ia = 0;
                            qa = c[p >> 2] | 0;
                            if ((qa & 1024 | 0) != 0) {
                                sa = c[Z >> 2] | 0;
                                La = sa >>> 0 > pa >>> 0;
                                ra = La ? pa : sa;
                                if (((La ? pa : sa) | 0) != 0) {
                                    ta = c[G >> 2] | 0;
                                    if ((ta | 0) != 0 ? (z = c[ta + 16 >> 2] | 0, (z | 0) != 0) : 0) {
                                        qa = (c[ta + 20 >> 2] | 0) - sa | 0;
                                        La = c[ta + 24 >> 2] | 0;
                                        xb(z + qa | 0, ma | 0, ((qa + ra | 0) >>> 0 > La >>> 0 ? La - qa | 0 : ra) | 0) | 0;
                                        qa = c[p >> 2] | 0
                                    }
                                    if ((qa & 512 | 0) != 0) {
                                        c[o >> 2] = rb(c[o >> 2] | 0, ma, ra) | 0
                                    }
                                    sa = (c[Z >> 2] | 0) - ra | 0;
                                    c[Z >> 2] = sa;
                                    pa = pa - ra | 0;
                                    ma = ma + ra | 0
                                }
                                if ((sa | 0) != 0) {
                                    break a
                                }
                            }
                            c[Z >> 2] = 0;
                            c[h >> 2] = 6;
                            ia = 81
                        } else if ((ia | 0) == 201) {
                            ia = 0;
                            if (!(pa >>> 0 > 5 & ja >>> 0 > 257)) {
                                c[aa >> 2] = 0;
                                sa = (1 << c[U >> 2]) + -1 | 0;
                                ra = c[T >> 2] | 0;
                                while (1) {
                                    va = ra + ((oa & sa) << 2) | 0;
                                    va = e[va >> 1] | e[va + 2 >> 1] << 16;
                                    ua = va >>> 8;
                                    qa = ua & 255;
                                    if (!(qa >>> 0 > na >>> 0)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                sa = va & 255;
                                ta = va >>> 16;
                                if (!(sa << 24 >> 24 == 0)) {
                                    if ((sa & 255) < 16) {
                                        sa = va >>> 16;
                                        va = (1 << qa + (va & 255)) + -1 | 0;
                                        while (1) {
                                            ta = ra + (sa + ((oa & va) >>> qa) << 2) | 0;
                                            ta = e[ta >> 1] | e[ta + 2 >> 1] << 16;
                                            ua = ta >>> 8;
                                            if (!((qa + (ua & 255) | 0) >>> 0 > na >>> 0)) {
                                                break
                                            }
                                            if ((pa | 0) == 0) {
                                                pa = 0;
                                                break a
                                            }
                                            La = oa + (d[ma >> 0] << na) | 0;
                                            na = na + 8 | 0;
                                            pa = pa + -1 | 0;
                                            oa = La;
                                            ma = ma + 1 | 0
                                        }
                                        c[aa >> 2] = qa;
                                        ra = qa;
                                        na = na - qa | 0;
                                        sa = ta & 255;
                                        ta = ta >>> 16;
                                        oa = oa >>> qa
                                    } else {
                                        ra = 0
                                    }
                                } else {
                                    ra = 0;
                                    sa = 0
                                }
                                La = ua & 255;
                                oa = oa >>> La;
                                na = na - La | 0;
                                c[aa >> 2] = ra + La;
                                c[Z >> 2] = ta;
                                if (sa << 24 >> 24 == 0) {
                                    c[h >> 2] = 25;
                                    qa = ja;
                                    break
                                }
                                if (!((sa & 32) == 0)) {
                                    c[aa >> 2] = -1;
                                    c[h >> 2] = 11;
                                    qa = ja;
                                    break
                                }
                                if ((sa & 64) == 0) {
                                    qa = sa & 15;
                                    c[H >> 2] = qa;
                                    c[h >> 2] = 21;
                                    ia = 286;
                                    break
                                } else {
                                    c[J >> 2] = 14184;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                            }
                            c[k >> 2] = ka;
                            c[u >> 2] = ja;
                            c[f >> 2] = ma;
                            c[t >> 2] = pa;
                            c[x >> 2] = oa;
                            c[l >> 2] = na;
                            ua = c[v >> 2] | 0;
                            Da = c[f >> 2] | 0;
                            na = Da + ((c[t >> 2] | 0) + -6) | 0;
                            Ca = c[k >> 2] | 0;
                            oa = c[u >> 2] | 0;
                            ma = Ca + (oa + -258) | 0;
                            Ba = c[ua + 40 >> 2] | 0;
                            ra = c[ua + 44 >> 2] | 0;
                            Aa = c[ua + 48 >> 2] | 0;
                            wa = c[ua + 52 >> 2] | 0;
                            ja = ua + 56 | 0;
                            ka = ua + 60 | 0;
                            ta = c[ua + 76 >> 2] | 0;
                            ya = c[ua + 80 >> 2] | 0;
                            qa = (1 << c[ua + 84 >> 2]) + -1 | 0;
                            va = (1 << c[ua + 88 >> 2]) + -1 | 0;
                            oa = Ca + (oa - ha + -1) | 0;
                            pa = ua + 7104 | 0;
                            za = wa + -1 | 0;
                            xa = (Aa | 0) == 0;
                            sa = Ba + Aa | 0;
                            Fa = c[ka >> 2] | 0;
                            Ea = c[ja >> 2] | 0;
                            Da = Da + -1 | 0;
                            Ca = Ca + -1 | 0;
                            d: do {
                                if (Fa >>> 0 < 15) {
                                    La = Da + 2 | 0;
                                    Ga = Fa + 16 | 0;
                                    Ea = Ea + (d[Da + 1 >> 0] << Fa) + (d[La >> 0] << Fa + 8) | 0;
                                    Da = La
                                } else {
                                    Ga = Fa
                                }
                                ia = Ea & qa;
                                Fa = Ga;
                                while (1) {
                                    Ga = ta + (ia << 2) | 0;
                                    Ga = e[Ga >> 1] | e[Ga + 2 >> 1] << 16;
                                    Ia = Ga >>> 16;
                                    La = Ga >>> 8 & 255;
                                    Ea = Ea >>> La;
                                    Fa = Fa - La | 0;
                                    if ((Ga & 255) << 24 >> 24 == 0) {
                                        ia = 207;
                                        break
                                    }
                                    if ((Ga & 16 | 0) != 0) {
                                        ia = 209;
                                        break
                                    }
                                    if ((Ga & 64 | 0) != 0) {
                                        ia = 256;
                                        break d
                                    }
                                    ia = Ia + (Ea & (1 << (Ga & 255)) + -1) | 0
                                }
                                do {
                                    if ((ia | 0) == 207) {
                                        ia = 0;
                                        Ca = Ca + 1 | 0;
                                        a[Ca >> 0] = Ia
                                    } else if ((ia | 0) == 209) {
                                        ia = 0;
                                        Ga = Ga & 15;
                                        if ((Ga | 0) != 0) {
                                            if (Fa >>> 0 < Ga >>> 0) {
                                                Da = Da + 1 | 0;
                                                Ka = Fa + 8 | 0;
                                                Ja = Ea + (d[Da >> 0] << Fa) | 0
                                            } else {
                                                Ka = Fa;
                                                Ja = Ea
                                            }
                                            Fa = Ka - Ga | 0;
                                            Ea = Ja >>> Ga;
                                            Ia = Ia + (Ja & (1 << Ga) + -1) | 0
                                        }
                                        if (Fa >>> 0 < 15) {
                                            La = Da + 2 | 0;
                                            Ja = Fa + 16 | 0;
                                            Ea = Ea + (d[Da + 1 >> 0] << Fa) + (d[La >> 0] << Fa + 8) | 0;
                                            Da = La
                                        } else {
                                            Ja = Fa
                                        }
                                        Ga = Ea & va;
                                        Fa = Ja;
                                        while (1) {
                                            Ja = ya + (Ga << 2) | 0;
                                            Ja = e[Ja >> 1] | e[Ja + 2 >> 1] << 16;
                                            Ga = Ja >>> 16;
                                            La = Ja >>> 8 & 255;
                                            Ea = Ea >>> La;
                                            Fa = Fa - La | 0;
                                            if ((Ja & 16 | 0) != 0) {
                                                break
                                            }
                                            if ((Ja & 64 | 0) != 0) {
                                                ia = 253;
                                                break d
                                            }
                                            Ga = Ga + (Ea & (1 << (Ja & 255)) + -1) | 0
                                        }
                                        Ja = Ja & 15;
                                        if (Fa >>> 0 < Ja >>> 0) {
                                            Ka = Da + 1 | 0;
                                            Ea = Ea + (d[Ka >> 0] << Fa) | 0;
                                            La = Fa + 8 | 0;
                                            if (La >>> 0 < Ja >>> 0) {
                                                Da = Da + 2 | 0;
                                                Fa = Fa + 16 | 0;
                                                Ea = Ea + (d[Da >> 0] << La) | 0
                                            } else {
                                                Fa = La;
                                                Da = Ka
                                            }
                                        }
                                        Ga = Ga + (Ea & (1 << Ja) + -1) | 0;
                                        Ea = Ea >>> Ja;
                                        Fa = Fa - Ja | 0;
                                        Ja = Ca - oa | 0;
                                        if (!(Ga >>> 0 > Ja >>> 0)) {
                                            Ga = Ca + (0 - Ga) | 0;
                                            while (1) {
                                                a[Ca + 1 >> 0] = a[Ga + 1 >> 0] | 0;
                                                a[Ca + 2 >> 0] = a[Ga + 2 >> 0] | 0;
                                                Ka = Ga + 3 | 0;
                                                Ja = Ca + 3 | 0;
                                                a[Ja >> 0] = a[Ka >> 0] | 0;
                                                Ia = Ia + -3 | 0;
                                                if (!(Ia >>> 0 > 2)) {
                                                    break
                                                } else {
                                                    Ga = Ka;
                                                    Ca = Ja
                                                }
                                            }
                                            if ((Ia | 0) == 0) {
                                                Ca = Ja;
                                                break
                                            }
                                            Ja = Ca + 4 | 0;
                                            a[Ja >> 0] = a[Ga + 4 >> 0] | 0;
                                            if (!(Ia >>> 0 > 1)) {
                                                Ca = Ja;
                                                break
                                            }
                                            Ca = Ca + 5 | 0;
                                            a[Ca >> 0] = a[Ga + 5 >> 0] | 0;
                                            break
                                        }
                                        Ja = Ga - Ja | 0;
                                        if (Ja >>> 0 > ra >>> 0 ? (c[pa >> 2] | 0) != 0 : 0) {
                                            ia = 223;
                                            break d
                                        }
                                        do {
                                            if (xa) {
                                                Ka = wa + (Ba - Ja + -1) | 0;
                                                if (Ja >>> 0 < Ia >>> 0) {
                                                    Ia = Ia - Ja | 0;
                                                    while (1) {
                                                        Ka = Ka + 1 | 0;
                                                        La = Ca + 1 | 0;
                                                        a[La >> 0] = a[Ka >> 0] | 0;
                                                        Ja = Ja + -1 | 0;
                                                        if ((Ja | 0) == 0) {
                                                            break
                                                        } else {
                                                            Ca = La
                                                        }
                                                    }
                                                    Ga = Ca + (1 - Ga) | 0;
                                                    Ca = La
                                                } else {
                                                    Ga = Ka
                                                }
                                            } else {
                                                if (!(Aa >>> 0 < Ja >>> 0)) {
                                                    Ka = wa + (Aa - Ja + -1) | 0;
                                                    if (!(Ja >>> 0 < Ia >>> 0)) {
                                                        Ga = Ka;
                                                        break
                                                    }
                                                    Ia = Ia - Ja | 0;
                                                    La = Ca;
                                                    while (1) {
                                                        Ka = Ka + 1 | 0;
                                                        Ca = La + 1 | 0;
                                                        a[Ca >> 0] = a[Ka >> 0] | 0;
                                                        Ja = Ja + -1 | 0;
                                                        if ((Ja | 0) == 0) {
                                                            break
                                                        } else {
                                                            La = Ca
                                                        }
                                                    }
                                                    Ga = La + (1 - Ga) | 0;
                                                    break
                                                }
                                                Ka = wa + (sa - Ja + -1) | 0;
                                                Ja = Ja - Aa | 0;
                                                if (Ja >>> 0 < Ia >>> 0) {
                                                    Ia = Ia - Ja | 0;
                                                    do {
                                                        Ka = Ka + 1 | 0;
                                                        Ca = Ca + 1 | 0;
                                                        a[Ca >> 0] = a[Ka >> 0] | 0;
                                                        Ja = Ja + -1 | 0
                                                    } while ((Ja | 0) != 0);
                                                    if (!(Aa >>> 0 < Ia >>> 0)) {
                                                        Ga = za;
                                                        break
                                                    }
                                                    Ia = Ia - Aa | 0;
                                                    Ka = za;
                                                    La = Aa;
                                                    while (1) {
                                                        Ka = Ka + 1 | 0;
                                                        Ja = Ca + 1 | 0;
                                                        a[Ja >> 0] = a[Ka >> 0] | 0;
                                                        La = La + -1 | 0;
                                                        if ((La | 0) == 0) {
                                                            break
                                                        } else {
                                                            Ca = Ja
                                                        }
                                                    }
                                                    Ga = Ca + (1 - Ga) | 0;
                                                    Ca = Ja
                                                } else {
                                                    Ga = Ka
                                                }
                                            }
                                        } while (0);
                                        while (1) {
                                            if (!(Ia >>> 0 > 2)) {
                                                break
                                            }
                                            a[Ca + 1 >> 0] = a[Ga + 1 >> 0] | 0;
                                            a[Ca + 2 >> 0] = a[Ga + 2 >> 0] | 0;
                                            Ka = Ga + 3 | 0;
                                            La = Ca + 3 | 0;
                                            a[La >> 0] = a[Ka >> 0] | 0;
                                            Ga = Ka;
                                            Ia = Ia + -3 | 0;
                                            Ca = La
                                        }
                                        if ((Ia | 0) != 0) {
                                            Ja = Ca + 1 | 0;
                                            a[Ja >> 0] = a[Ga + 1 >> 0] | 0;
                                            if (Ia >>> 0 > 1) {
                                                Ca = Ca + 2 | 0;
                                                a[Ca >> 0] = a[Ga + 2 >> 0] | 0
                                            } else {
                                                Ca = Ja
                                            }
                                        }
                                    }
                                } while (0)
                            } while (Da >>> 0 < na >>> 0 & Ca >>> 0 < ma >>> 0);
                            do {
                                if ((ia | 0) == 223) {
                                    ia = 0;
                                    c[J >> 2] = 14128;
                                    c[ua >> 2] = 29
                                } else if ((ia | 0) == 253) {
                                    ia = 0;
                                    c[J >> 2] = 14160;
                                    c[ua >> 2] = 29
                                } else if ((ia | 0) == 256) {
                                    ia = 0;
                                    if ((Ga & 32 | 0) == 0) {
                                        c[J >> 2] = 14184;
                                        c[ua >> 2] = 29;
                                        break
                                    } else {
                                        c[ua >> 2] = 11;
                                        break
                                    }
                                }
                            } while (0);
                            La = Fa >>> 3;
                            pa = Da + (0 - La) | 0;
                            oa = Fa - (La << 3) | 0;
                            c[f >> 2] = Da + (1 - La);
                            c[k >> 2] = Ca + 1;
                            if (pa >>> 0 < na >>> 0) {
                                na = na - pa | 0
                            } else {
                                na = na - pa | 0
                            }
                            c[t >> 2] = na + 5;
                            if (Ca >>> 0 < ma >>> 0) {
                                ma = ma - Ca | 0
                            } else {
                                ma = ma - Ca | 0
                            }
                            c[u >> 2] = ma + 257;
                            c[ja >> 2] = Ea & (1 << oa) + -1;
                            c[ka >> 2] = oa;
                            ka = c[k >> 2] | 0;
                            qa = c[u >> 2] | 0;
                            ma = c[f >> 2] | 0;
                            pa = c[t >> 2] | 0;
                            oa = c[x >> 2] | 0;
                            na = c[l >> 2] | 0;
                            if ((c[h >> 2] | 0) == 11) {
                                c[aa >> 2] = -1
                            }
                        }
                    } while (0);
                    if ((ia | 0) == 81) {
                        ia = 0;
                        if ((qa & 2048 | 0) == 0) {
                            ia = c[G >> 2] | 0;
                            if ((ia | 0) != 0) {
                                c[ia + 28 >> 2] = 0
                            }
                        } else {
                            if ((pa | 0) == 0) {
                                pa = 0;
                                break
                            } else {
                                ra = 0
                            }
                            do {
                                qa = ra;
                                ra = ra + 1 | 0;
                                qa = a[ma + qa >> 0] | 0;
                                sa = c[G >> 2] | 0;
                                if (((sa | 0) != 0 ? (C = sa + 28 | 0, (c[C >> 2] | 0) != 0) : 0) ? (B = c[Z >> 2] | 0, B >>> 0 < (c[sa + 32 >> 2] | 0) >>> 0) : 0) {
                                    c[Z >> 2] = B + 1;
                                    a[(c[C >> 2] | 0) + B >> 0] = qa
                                }
                            } while (qa << 24 >> 24 != 0 & ra >>> 0 < pa >>> 0);
                            if ((c[p >> 2] & 512 | 0) != 0) {
                                c[o >> 2] = rb(c[o >> 2] | 0, ma, ra) | 0
                            }
                            pa = pa - ra | 0;
                            ma = ma + ra | 0;
                            if (!(qa << 24 >> 24 == 0)) {
                                break
                            }
                        }
                        c[Z >> 2] = 0;
                        c[h >> 2] = 7;
                        ia = 94
                    } else if ((ia | 0) == 286) {
                        ia = 0;
                        if ((qa | 0) == 0) {
                            ia = c[Z >> 2] | 0
                        } else {
                            while (1) {
                                if (!(na >>> 0 < qa >>> 0)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                La = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = La;
                                ma = ma + 1 | 0
                            }
                            ia = (c[Z >> 2] | 0) + (oa & (1 << qa) + -1) | 0;
                            c[Z >> 2] = ia;
                            c[aa >> 2] = (c[aa >> 2] | 0) + qa;
                            na = na - qa | 0;
                            oa = oa >>> qa
                        }
                        c[fa >> 2] = ia;
                        c[h >> 2] = 22;
                        ia = 293
                    }
                    do {
                        if ((ia | 0) == 94) {
                            ia = 0;
                            if ((c[p >> 2] & 4096 | 0) == 0) {
                                ia = c[G >> 2] | 0;
                                if ((ia | 0) != 0) {
                                    c[ia + 36 >> 2] = 0
                                }
                            } else {
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                } else {
                                    ra = 0
                                }
                                do {
                                    qa = ra;
                                    ra = ra + 1 | 0;
                                    qa = a[ma + qa >> 0] | 0;
                                    sa = c[G >> 2] | 0;
                                    if (((sa | 0) != 0 ? (y = sa + 36 | 0, (c[y >> 2] | 0) != 0) : 0) ? (E = c[Z >> 2] | 0, E >>> 0 < (c[sa + 40 >> 2] | 0) >>> 0) : 0) {
                                        c[Z >> 2] = E + 1;
                                        a[(c[y >> 2] | 0) + E >> 0] = qa
                                    }
                                } while (qa << 24 >> 24 != 0 & ra >>> 0 < pa >>> 0);
                                if ((c[p >> 2] & 512 | 0) != 0) {
                                    c[o >> 2] = rb(c[o >> 2] | 0, ma, ra) | 0
                                }
                                pa = pa - ra | 0;
                                ma = ma + ra | 0;
                                if (!(qa << 24 >> 24 == 0)) {
                                    break a
                                }
                            }
                            c[h >> 2] = 8;
                            ia = 107
                        } else if ((ia | 0) == 293) {
                            ia = 0;
                            sa = (1 << c[W >> 2]) + -1 | 0;
                            ra = c[V >> 2] | 0;
                            while (1) {
                                ta = ra + ((oa & sa) << 2) | 0;
                                ta = e[ta >> 1] | e[ta + 2 >> 1] << 16;
                                ua = ta >>> 8;
                                qa = ua & 255;
                                if (!(qa >>> 0 > na >>> 0)) {
                                    break
                                }
                                if ((pa | 0) == 0) {
                                    pa = 0;
                                    break a
                                }
                                La = oa + (d[ma >> 0] << na) | 0;
                                na = na + 8 | 0;
                                pa = pa + -1 | 0;
                                oa = La;
                                ma = ma + 1 | 0
                            }
                            sa = ta & 255;
                            if ((sa & 255) < 16) {
                                sa = ta >>> 16;
                                va = (1 << qa + (ta & 255)) + -1 | 0;
                                while (1) {
                                    ta = ra + (sa + ((oa & va) >>> qa) << 2) | 0;
                                    ta = e[ta >> 1] | e[ta + 2 >> 1] << 16;
                                    ua = ta >>> 8;
                                    if (!((qa + (ua & 255) | 0) >>> 0 > na >>> 0)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                ra = (c[aa >> 2] | 0) + qa | 0;
                                c[aa >> 2] = ra;
                                na = na - qa | 0;
                                sa = ta & 255;
                                oa = oa >>> qa
                            } else {
                                ra = c[aa >> 2] | 0
                            }
                            La = ua & 255;
                            oa = oa >>> La;
                            na = na - La | 0;
                            c[aa >> 2] = ra + La;
                            if ((sa & 64) == 0) {
                                c[ea >> 2] = ta >>> 16;
                                qa = sa & 15;
                                c[H >> 2] = qa;
                                c[h >> 2] = 23;
                                ia = 307;
                                break
                            } else {
                                c[J >> 2] = 14160;
                                c[h >> 2] = 29;
                                qa = ja;
                                break
                            }
                        }
                    } while (0);
                    do {
                        if ((ia | 0) == 107) {
                            ia = 0;
                            qa = c[p >> 2] | 0;
                            if ((qa & 512 | 0) != 0) {
                                while (1) {
                                    if (!(na >>> 0 < 16)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                if ((oa | 0) == (c[o >> 2] & 65535 | 0)) {
                                    na = 0;
                                    oa = 0
                                } else {
                                    c[J >> 2] = 424;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                            }
                            ra = c[G >> 2] | 0;
                            if ((ra | 0) != 0) {
                                c[ra + 44 >> 2] = qa >>> 9 & 1;
                                c[(c[G >> 2] | 0) + 48 >> 2] = 1
                            }
                            c[o >> 2] = 0;
                            c[n >> 2] = 0;
                            c[h >> 2] = 11;
                            qa = ja
                        } else if ((ia | 0) == 307) {
                            ia = 0;
                            if ((qa | 0) != 0) {
                                while (1) {
                                    if (!(na >>> 0 < qa >>> 0)) {
                                        break
                                    }
                                    if ((pa | 0) == 0) {
                                        pa = 0;
                                        break a
                                    }
                                    La = oa + (d[ma >> 0] << na) | 0;
                                    na = na + 8 | 0;
                                    pa = pa + -1 | 0;
                                    oa = La;
                                    ma = ma + 1 | 0
                                }
                                c[ea >> 2] = (c[ea >> 2] | 0) + (oa & (1 << qa) + -1);
                                c[aa >> 2] = (c[aa >> 2] | 0) + qa;
                                na = na - qa | 0;
                                oa = oa >>> qa
                            }
                            c[h >> 2] = 24;
                            ia = 313
                        }
                    } while (0);
                    do {
                        if ((ia | 0) == 313) {
                            ia = 0;
                            if ((ja | 0) == 0) {
                                break a
                            }
                            qa = ha - ja | 0;
                            sa = c[ea >> 2] | 0;
                            if (sa >>> 0 > qa >>> 0) {
                                ra = sa - qa | 0;
                                if (ra >>> 0 > (c[ba >> 2] | 0) >>> 0 ? (c[N >> 2] | 0) != 0 : 0) {
                                    c[J >> 2] = 14128;
                                    c[h >> 2] = 29;
                                    qa = ja;
                                    break
                                }
                                sa = c[ca >> 2] | 0;
                                if (ra >>> 0 > sa >>> 0) {
                                    sa = ra - sa | 0;
                                    qa = sa;
                                    sa = (c[da >> 2] | 0) + ((c[w >> 2] | 0) - sa) | 0
                                } else {
                                    qa = ra;
                                    sa = (c[da >> 2] | 0) + (sa - ra) | 0
                                }
                                La = c[Z >> 2] | 0;
                                ra = La;
                                qa = qa >>> 0 > La >>> 0 ? La : qa
                            } else {
                                qa = c[Z >> 2] | 0;
                                ra = qa;
                                sa = ka + (0 - sa) | 0
                            }
                            La = qa >>> 0 > ja >>> 0 ? ja : qa;
                            qa = ja - La | 0;
                            c[Z >> 2] = ra - La;
                            ja = La;
                            while (1) {
                                La = ka;
                                ka = ka + 1 | 0;
                                a[La >> 0] = a[sa >> 0] | 0;
                                ja = ja + -1 | 0;
                                if ((ja | 0) == 0) {
                                    break
                                } else {
                                    sa = sa + 1 | 0
                                }
                            }
                            if ((c[Z >> 2] | 0) == 0) {
                                c[h >> 2] = 20
                            }
                        }
                    } while (0);
                    ra = c[h >> 2] | 0;
                    ja = qa
                }
                if ((ia | 0) == 121) {
                    c[k >> 2] = ka;
                    c[u >> 2] = ja;
                    c[f >> 2] = ma;
                    c[t >> 2] = pa;
                    c[x >> 2] = oa;
                    c[l >> 2] = na;
                    La = 2;
                    i = g;
                    return La | 0
                } else if ((ia | 0) == 351) {
                    c[h >> 2] = 28;
                    la = 1
                } else if ((ia | 0) == 352) {
                    la = -3
                } else if ((ia | 0) == 353) {
                    La = -2;
                    i = g;
                    return La | 0
                } else if ((ia | 0) == 377) {
                    i = g;
                    return f | 0
                }
                c[k >> 2] = ka;
                c[u >> 2] = ja;
                c[f >> 2] = ma;
                c[t >> 2] = pa;
                c[x >> 2] = oa;
                c[l >> 2] = na;
                x = c[u >> 2] | 0;
                if ((c[w >> 2] | 0) == 0) {
                    if ((ha | 0) != (x | 0)) {
                        if ((c[h >> 2] | 0) >>> 0 < 29) {
                            w = x;
                            ia = 357
                        } else {
                            u = x
                        }
                    } else {
                        u = ha
                    }
                } else {
                    w = x;
                    ia = 357
                }
                if ((ia | 0) == 357) {
                    x = c[k >> 2] | 0;
                    w = ha - w | 0;
                    v = c[v >> 2] | 0;
                    A = c[v + 52 >> 2] | 0;
                    if ((A | 0) == 0) {
                        A = Ha[c[f + 32 >> 2] & 1](c[f + 40 >> 2] | 0, 1 << c[v + 36 >> 2], 1) | 0;
                        c[v + 52 >> 2] = A;
                        if ((A | 0) == 0) {
                            c[h >> 2] = 30;
                            La = -4;
                            i = g;
                            return La | 0
                        }
                    }
                    y = v + 40 | 0;
                    B = c[y >> 2] | 0;
                    if ((B | 0) == 0) {
                        B = 1 << c[v + 36 >> 2];
                        c[y >> 2] = B;
                        c[v + 48 >> 2] = 0;
                        c[v + 44 >> 2] = 0
                    }
                    do {
                        if (w >>> 0 < B >>> 0) {
                            z = v + 48 | 0;
                            Ka = c[z >> 2] | 0;
                            La = B - Ka | 0;
                            La = La >>> 0 > w >>> 0 ? w : La;
                            xb(A + Ka | 0, x + (0 - w) | 0, La | 0) | 0;
                            A = w - La | 0;
                            if ((w | 0) != (La | 0)) {
                                xb(c[v + 52 >> 2] | 0, x + (0 - A) | 0, A | 0) | 0;
                                c[z >> 2] = A;
                                c[v + 44 >> 2] = c[y >> 2];
                                break
                            }
                            x = (c[z >> 2] | 0) + w | 0;
                            c[z >> 2] = x;
                            La = c[y >> 2] | 0;
                            c[z >> 2] = (x | 0) == (La | 0) ? 0 : x;
                            x = v + 44 | 0;
                            v = c[x >> 2] | 0;
                            if (v >>> 0 < La >>> 0) {
                                c[x >> 2] = v + w
                            }
                        } else {
                            xb(A | 0, x + (0 - B) | 0, B | 0) | 0;
                            c[v + 48 >> 2] = 0;
                            c[v + 44 >> 2] = c[y >> 2]
                        }
                    } while (0);
                    u = c[u >> 2] | 0
                }
                t = c[t >> 2] | 0;
                v = ha - u | 0;
                La = f + 8 | 0;
                c[La >> 2] = (c[La >> 2] | 0) + (j - t);
                c[q >> 2] = (c[q >> 2] | 0) + v;
                c[r >> 2] = (c[r >> 2] | 0) + v;
                if (!((c[s >> 2] | 0) == 0 | (ha | 0) == (u | 0))) {
                    q = c[o >> 2] | 0;
                    k = (c[k >> 2] | 0) + (0 - v) | 0;
                    if ((c[p >> 2] | 0) == 0) {
                        k = qb(q, k, v) | 0
                    } else {
                        k = rb(q, k, v) | 0
                    }
                    c[o >> 2] = k;
                    c[n >> 2] = k
                }
                h = c[h >> 2] | 0;
                k = (c[l >> 2] | 0) + ((c[m >> 2] | 0) != 0 ? 64 : 0) + ((h | 0) == 11 ? 128 : 0) | 0;
                if ((h | 0) == 19) {
                    Ka = 256;
                    Ka = k + Ka | 0;
                    La = f + 44 | 0;
                    c[La >> 2] = Ka;
                    La = (j | 0) == (t | 0);
                    Ka = (ha | 0) == (u | 0);
                    Ka = La & Ka;
                    La = (la | 0) == 0;
                    La = Ka & La;
                    La = La ? -5 : la;
                    i = g;
                    return La | 0
                }
                Ka = (h | 0) == 14 ? 256 : 0;
                Ka = k + Ka | 0;
                La = f + 44 | 0;
                c[La >> 2] = Ka;
                La = (j | 0) == (t | 0);
                Ka = (ha | 0) == (u | 0);
                Ka = La & Ka;
                La = (la | 0) == 0;
                La = Ka & La;
                La = La ? -5 : la;
                i = g;
                return La | 0
            }
            function cb(d, f, g, h, j, k) {
                d = d | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                k = k | 0;
                var l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0, I = 0;
                n = i;
                i = i + 64 | 0;
                m = n + 32 | 0;
                q = n;
                o = 0;
                while (1) {
                    if (!(o >>> 0 < 16)) {
                        o = 0;
                        break
                    }
                    b[m + (o << 1) >> 1] = 0;
                    o = o + 1 | 0
                }
                while (1) {
                    if (!(o >>> 0 < g >>> 0)) {
                        break
                    }
                    H = m + (e[f + (o << 1) >> 1] << 1) | 0;
                    b[H >> 1] = (b[H >> 1] | 0) + 1 << 16 >> 16;
                    o = o + 1 | 0
                }
                p = c[j >> 2] | 0;
                o = 15;
                while (1) {
                    s = (o | 0) == 0;
                    if (s) {
                        break
                    }
                    if ((b[m + (o << 1) >> 1] | 0) != 0) {
                        break
                    }
                    o = o + -1 | 0
                }
                p = p >>> 0 > o >>> 0 ? o : p;
                if (s) {
                    H = c[h >> 2] | 0;
                    c[h >> 2] = H + 4;
                    b[H >> 1] = 320;
                    b[H + 2 >> 1] = 320 >>> 16;
                    H = c[h >> 2] | 0;
                    c[h >> 2] = H + 4;
                    b[H >> 1] = 320;
                    b[H + 2 >> 1] = 320 >>> 16;
                    c[j >> 2] = 1;
                    H = 0;
                    i = n;
                    return H | 0
                } else {
                    C = 1
                }
                while (1) {
                    if (!(C >>> 0 < o >>> 0)) {
                        break
                    }
                    if ((b[m + (C << 1) >> 1] | 0) != 0) {
                        break
                    }
                    C = C + 1 | 0
                }
                p = p >>> 0 < C >>> 0 ? C : p;
                u = 1;
                t = 1;
                while (1) {
                    if (!(t >>> 0 < 16)) {
                        break
                    }
                    s = (u << 1) - (e[m + (t << 1) >> 1] | 0) | 0;
                    if ((s | 0) < 0) {
                        l = -1;
                        r = 60;
                        break
                    }
                    u = s;
                    t = t + 1 | 0
                }
                if ((r | 0) == 60) {
                    i = n;
                    return l | 0
                }
                if ((u | 0) > 0 ? !((d | 0) != 0 & (o | 0) == 1) : 0) {
                    H = -1;
                    i = n;
                    return H | 0
                }
                b[q + 2 >> 1] = 0;
                s = 0;
                r = 1;
                while (1) {
                    if (!(r >>> 0 < 15)) {
                        s = 0;
                        break
                    }
                    G = (s & 65535) + (e[m + (r << 1) >> 1] | 0) | 0;
                    H = r + 1 | 0;
                    b[q + (H << 1) >> 1] = G;
                    s = G;
                    r = H
                }
                while (1) {
                    if (!(s >>> 0 < g >>> 0)) {
                        break
                    }
                    r = b[f + (s << 1) >> 1] | 0;
                    if (!(r << 16 >> 16 == 0)) {
                        G = q + ((r & 65535) << 1) | 0;
                        H = b[G >> 1] | 0;
                        b[G >> 1] = H + 1 << 16 >> 16;
                        b[k + ((H & 65535) << 1) >> 1] = s
                    }
                    s = s + 1 | 0
                }
                if ((d | 0) == 0) {
                    x = 1 << p;
                    q = x + -1 | 0;
                    w = c[h >> 2] | 0;
                    r = (d | 0) == 1;
                    u = k;
                    t = 19;
                    v = k
                } else if ((d | 0) == 1) {
                    x = 1 << p;
                    if (x >>> 0 > 852) {
                        H = 1;
                        i = n;
                        return H | 0
                    } else {
                        q = x + -1 | 0;
                        w = c[h >> 2] | 0;
                        r = (d | 0) == 1;
                        u = 2928 + -514 | 0;
                        t = 256;
                        v = 2992 + -514 | 0
                    }
                } else {
                    x = 1 << p;
                    if ((d | 0) == 2 & x >>> 0 > 592) {
                        H = 1;
                        i = n;
                        return H | 0
                    } else {
                        q = x + -1 | 0;
                        w = c[h >> 2] | 0;
                        r = (d | 0) == 1;
                        u = 3056;
                        t = -1;
                        v = 3120
                    }
                }
                s = p & 255;
                A = p;
                g = 0;
                B = 0;
                z = -1;
                y = 0;
                a: while (1) {
                    A = 1 << A;
                    while (1) {
                        F = C - g | 0;
                        H = b[k + (y << 1) >> 1] | 0;
                        D = H & 65535;
                        if ((D | 0) >= (t | 0)) {
                            if ((D | 0) > (t | 0)) {
                                G = b[v + (D << 1) >> 1] & 255;
                                H = b[u + (D << 1) >> 1] | 0
                            } else {
                                G = 96;
                                H = 0
                            }
                        } else {
                            G = 0
                        }
                        E = 1 << F;
                        D = B >>> g;
                        G = (H & 65535) << 16 | F << 8 & 65280 | G;
                        F = A;
                        do {
                            H = F;
                            F = F - E | 0;
                            I = w + (D + F << 2) | 0;
                            b[I >> 1] = G;
                            b[I + 2 >> 1] = G >>> 16
                        } while ((H | 0) != (E | 0));
                        D = 1 << C + -1;
                        while (1) {
                            if ((B & D | 0) == 0) {
                                break
                            }
                            D = D >>> 1
                        }
                        if ((D | 0) == 0) {
                            B = 0
                        } else {
                            B = (B & D + -1) + D | 0
                        }
                        y = y + 1 | 0;
                        H = m + (C << 1) | 0;
                        I = (b[H >> 1] | 0) + -1 << 16 >> 16;
                        b[H >> 1] = I;
                        if (I << 16 >> 16 == 0) {
                            if ((C | 0) == (o | 0)) {
                                r = 57;
                                break a
                            }
                            C = e[f + (e[k + (y << 1) >> 1] << 1) >> 1] | 0
                        }
                        if (!(C >>> 0 > p >>> 0)) {
                            continue
                        }
                        D = B & q;
                        if ((D | 0) != (z | 0)) {
                            break
                        }
                    }
                    z = (g | 0) == 0 ? p : g;
                    E = w + (A << 2) | 0;
                    F = C - z | 0;
                    A = F;
                    F = 1 << F;
                    while (1) {
                        G = A + z | 0;
                        if (!(G >>> 0 < o >>> 0)) {
                            break
                        }
                        F = F - (e[m + (G << 1) >> 1] | 0) | 0;
                        if ((F | 0) < 1) {
                            break
                        }
                        A = A + 1 | 0;
                        F = F << 1
                    }
                    F = x + (1 << A) | 0;
                    if (r) {
                        if (F >>> 0 > 852) {
                            l = 1;
                            r = 60;
                            break
                        }
                    } else {
                        if ((d | 0) == 2 & F >>> 0 > 592) {
                            l = 1;
                            r = 60;
                            break
                        }
                    }
                    a[(c[h >> 2] | 0) + (D << 2) >> 0] = A;
                    a[(c[h >> 2] | 0) + (D << 2) + 1 >> 0] = s;
                    g = c[h >> 2] | 0;
                    b[g + (D << 2) + 2 >> 1] = (E - g | 0) >>> 2;
                    g = z;
                    z = D;
                    w = E;
                    x = F
                }
                if ((r | 0) == 57) {
                    if ((B | 0) != 0) {
                        I = w + (B << 2) | 0;
                        H = o - g << 8 & 65280 | 64;
                        b[I >> 1] = H;
                        b[I + 2 >> 1] = H >>> 16
                    }
                    c[h >> 2] = (c[h >> 2] | 0) + (x << 2);
                    c[j >> 2] = p;
                    I = 0;
                    i = n;
                    return I | 0
                } else if ((r | 0) == 60) {
                    i = n;
                    return l | 0
                }
                return 0
            }
            function db(a) {
                a = a | 0;
                var d = 0, e = 0;
                d = i;
                e = 0;
                while (1) {
                    if ((e | 0) >= 286) {
                        e = 0;
                        break
                    }
                    b[a + (e << 2) + 148 >> 1] = 0;
                    e = e + 1 | 0
                }
                while (1) {
                    if ((e | 0) >= 30) {
                        e = 0;
                        break
                    }
                    b[a + (e << 2) + 2440 >> 1] = 0;
                    e = e + 1 | 0
                }
                while (1) {
                    if ((e | 0) >= 19) {
                        break
                    }
                    b[a + (e << 2) + 2684 >> 1] = 0;
                    e = e + 1 | 0
                }
                b[a + 1172 >> 1] = 1;
                c[a + 5804 >> 2] = 0;
                c[a + 5800 >> 2] = 0;
                c[a + 5808 >> 2] = 0;
                c[a + 5792 >> 2] = 0;
                i = d;
                return
            }
            function eb(d, f, g, h) {
                d = d | 0;
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0;
                j = i;
                k = d + 5820 | 0;
                l = c[k >> 2] | 0;
                h = h & 65535;
                m = d + 5816 | 0;
                n = e[m >> 1] | 0 | h << l;
                b[m >> 1] = n;
                if ((l | 0) > 13) {
                    p = d + 20 | 0;
                    l = c[p >> 2] | 0;
                    c[p >> 2] = l + 1;
                    o = d + 8 | 0;
                    a[(c[o >> 2] | 0) + l >> 0] = n;
                    n = (e[m >> 1] | 0) >>> 8 & 255;
                    l = c[p >> 2] | 0;
                    c[p >> 2] = l + 1;
                    a[(c[o >> 2] | 0) + l >> 0] = n;
                    l = c[k >> 2] | 0;
                    b[m >> 1] = h >>> (16 - l | 0);
                    l = l + -13 | 0
                } else {
                    l = l + 3 | 0
                }
                c[k >> 2] = l;
                kb(d);
                k = d + 20 | 0;
                o = c[k >> 2] | 0;
                c[k >> 2] = o + 1;
                d = d + 8 | 0;
                a[(c[d >> 2] | 0) + o >> 0] = g;
                o = g >>> 8;
                p = c[k >> 2] | 0;
                c[k >> 2] = p + 1;
                a[(c[d >> 2] | 0) + p >> 0] = o;
                p = c[k >> 2] | 0;
                c[k >> 2] = p + 1;
                a[(c[d >> 2] | 0) + p >> 0] = g ^ 255;
                p = c[k >> 2] | 0;
                c[k >> 2] = p + 1;
                a[(c[d >> 2] | 0) + p >> 0] = o ^ 255;
                while (1) {
                    if ((g | 0) == 0) {
                        break
                    }
                    o = a[f >> 0] | 0;
                    p = c[k >> 2] | 0;
                    c[k >> 2] = p + 1;
                    a[(c[d >> 2] | 0) + p >> 0] = o;
                    f = f + 1 | 0;
                    g = g + -1 | 0
                }
                i = j;
                return
            }
            function fb(d) {
                d = d | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
                f = i;
                g = d + 5820 | 0;
                h = c[g >> 2] | 0;
                if ((h | 0) == 16) {
                    h = d + 5816 | 0;
                    m = b[h >> 1] & 255;
                    l = d + 20 | 0;
                    k = c[l >> 2] | 0;
                    c[l >> 2] = k + 1;
                    j = d + 8 | 0;
                    a[(c[j >> 2] | 0) + k >> 0] = m;
                    k = (e[h >> 1] | 0) >>> 8 & 255;
                    d = c[l >> 2] | 0;
                    c[l >> 2] = d + 1;
                    a[(c[j >> 2] | 0) + d >> 0] = k;
                    b[h >> 1] = 0;
                    c[g >> 2] = 0;
                    i = f;
                    return
                }
                if ((h | 0) <= 7) {
                    i = f;
                    return
                }
                m = d + 5816 | 0;
                k = b[m >> 1] & 255;
                j = d + 20 | 0;
                l = c[j >> 2] | 0;
                c[j >> 2] = l + 1;
                a[(c[d + 8 >> 2] | 0) + l >> 0] = k;
                b[m >> 1] = (e[m >> 1] | 0) >>> 8;
                c[g >> 2] = (c[g >> 2] | 0) + -8;
                i = f;
                return
            }
            function gb(d) {
                d = d | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0;
                g = i;
                f = d + 5820 | 0;
                h = c[f >> 2] | 0;
                j = d + 5816 | 0;
                k = e[j >> 1] | 0 | 2 << h;
                b[j >> 1] = k;
                if ((h | 0) > 13) {
                    m = d + 20 | 0;
                    h = c[m >> 2] | 0;
                    c[m >> 2] = h + 1;
                    l = d + 8 | 0;
                    a[(c[l >> 2] | 0) + h >> 0] = k;
                    k = (e[j >> 1] | 0) >>> 8 & 255;
                    h = c[m >> 2] | 0;
                    c[m >> 2] = h + 1;
                    a[(c[l >> 2] | 0) + h >> 0] = k;
                    h = c[f >> 2] | 0;
                    k = 2 >>> (16 - h | 0);
                    b[j >> 1] = k;
                    h = h + -13 | 0
                } else {
                    h = h + 3 | 0
                }
                c[f >> 2] = h;
                if ((h | 0) > 9) {
                    l = d + 5816 | 0;
                    h = d + 20 | 0;
                    m = c[h >> 2] | 0;
                    c[h >> 2] = m + 1;
                    j = d + 8 | 0;
                    a[(c[j >> 2] | 0) + m >> 0] = k;
                    k = (e[l >> 1] | 0) >>> 8 & 255;
                    m = c[h >> 2] | 0;
                    c[h >> 2] = m + 1;
                    a[(c[j >> 2] | 0) + m >> 0] = k;
                    m = c[f >> 2] | 0;
                    b[l >> 1] = 0;
                    m = m + -9 | 0;
                    c[f >> 2] = m;
                    fb(d);
                    i = g;
                    return
                } else {
                    m = h + 7 | 0;
                    c[f >> 2] = m;
                    fb(d);
                    i = g;
                    return
                }
            }
            function hb(f, g, h, j) {
                f = f | 0;
                g = g | 0;
                h = h | 0;
                j = j | 0;
                var k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0;
                k = i;
                if ((c[f + 132 >> 2] | 0) > 0) {
                    l = (c[f >> 2] | 0) + 44 | 0;
                    if ((c[l >> 2] | 0) == 2) {
                        n = 1;
                        o = -201342849;
                        p = 0;
                        while (1) {
                            if (!n) {
                                m = 7;
                                break
                            }
                            if ((o & 1 | 0) != 0 ? (b[f + (p << 2) + 148 >> 1] | 0) != 0 : 0) {
                                n = 0;
                                break
                            }
                            u = p + 1 | 0;
                            n = (u | 0) < 32;
                            o = o >>> 1;
                            p = u
                        }
                        a: do {
                            if ((m | 0) == 7) {
                                if (((b[f + 184 >> 1] | 0) == 0 ? (b[f + 188 >> 1] | 0) == 0 : 0) ? (b[f + 200 >> 1] | 0) == 0 : 0) {
                                    m = 32;
                                    while (1) {
                                        if ((m | 0) >= 256) {
                                            n = 0;
                                            break a
                                        }
                                        if ((b[f + (m << 2) + 148 >> 1] | 0) != 0) {
                                            n = 1;
                                            break a
                                        }
                                        m = m + 1 | 0
                                    }
                                } else {
                                    n = 1
                                }
                            }
                        } while (0);
                        c[l >> 2] = n
                    }
                    ib(f, f + 2840 | 0);
                    ib(f, f + 2852 | 0);
                    mb(f, f + 148 | 0, c[f + 2844 >> 2] | 0);
                    mb(f, f + 2440 | 0, c[f + 2856 >> 2] | 0);
                    ib(f, f + 2864 | 0);
                    n = 18;
                    while (1) {
                        if ((n | 0) <= 2) {
                            break
                        }
                        if ((b[f + (d[5776 + n >> 0] << 2) + 2686 >> 1] | 0) != 0) {
                            break
                        }
                        n = n + -1 | 0
                    }
                    m = f + 5800 | 0;
                    o = (c[m >> 2] | 0) + ((n * 3 | 0) + 17) | 0;
                    c[m >> 2] = o;
                    o = (o + 10 | 0) >>> 3;
                    m = ((c[f + 5804 >> 2] | 0) + 10 | 0) >>> 3;
                    o = m >>> 0 > o >>> 0 ? o : m
                } else {
                    m = h + 5 | 0;
                    n = 0;
                    o = m
                }
                do {
                    if ((h + 4 | 0) >>> 0 > o >>> 0 | (g | 0) == 0) {
                        h = f + 5820 | 0;
                        g = c[h >> 2] | 0;
                        l = (g | 0) > 13;
                        if ((m | 0) == (o | 0) ? 1 : (c[f + 136 >> 2] | 0) == 4) {
                            m = j + 2 & 65535;
                            o = f + 5816 | 0;
                            n = e[o >> 1] | m << g;
                            b[o >> 1] = n;
                            if (l) {
                                s = f + 20 | 0;
                                t = c[s >> 2] | 0;
                                c[s >> 2] = t + 1;
                                u = f + 8 | 0;
                                a[(c[u >> 2] | 0) + t >> 0] = n;
                                t = (e[o >> 1] | 0) >>> 8 & 255;
                                g = c[s >> 2] | 0;
                                c[s >> 2] = g + 1;
                                a[(c[u >> 2] | 0) + g >> 0] = t;
                                g = c[h >> 2] | 0;
                                b[o >> 1] = m >>> (16 - g | 0);
                                g = g + -13 | 0
                            } else {
                                g = g + 3 | 0
                            }
                            c[h >> 2] = g;
                            jb(f, 4024, 5176);
                            break
                        }
                        o = j + 4 & 65535;
                        p = f + 5816 | 0;
                        m = e[p >> 1] | o << g;
                        r = m & 65535;
                        b[p >> 1] = r;
                        if (l) {
                            s = f + 20 | 0;
                            t = c[s >> 2] | 0;
                            c[s >> 2] = t + 1;
                            r = f + 8 | 0;
                            a[(c[r >> 2] | 0) + t >> 0] = m;
                            t = (e[p >> 1] | 0) >>> 8 & 255;
                            u = c[s >> 2] | 0;
                            c[s >> 2] = u + 1;
                            a[(c[r >> 2] | 0) + u >> 0] = t;
                            u = c[h >> 2] | 0;
                            r = o >>> (16 - u | 0) & 65535;
                            b[p >> 1] = r;
                            o = u + -13 | 0
                        } else {
                            o = g + 3 | 0
                        }
                        c[h >> 2] = o;
                        l = c[f + 2844 >> 2] | 0;
                        m = c[f + 2856 >> 2] | 0;
                        g = n + 1 | 0;
                        q = l + 65280 & 65535;
                        p = f + 5816 | 0;
                        s = r & 65535 | q << o;
                        r = s & 65535;
                        b[p >> 1] = r;
                        if ((o | 0) > 11) {
                            t = f + 20 | 0;
                            u = c[t >> 2] | 0;
                            c[t >> 2] = u + 1;
                            r = f + 8 | 0;
                            a[(c[r >> 2] | 0) + u >> 0] = s;
                            u = (e[p >> 1] | 0) >>> 8 & 255;
                            o = c[t >> 2] | 0;
                            c[t >> 2] = o + 1;
                            a[(c[r >> 2] | 0) + o >> 0] = u;
                            o = c[h >> 2] | 0;
                            r = q >>> (16 - o | 0) & 65535;
                            b[p >> 1] = r;
                            o = o + -11 | 0
                        } else {
                            o = o + 5 | 0
                        }
                        c[h >> 2] = o;
                        p = m & 65535;
                        q = f + 5816 | 0;
                        r = r & 65535 | p << o;
                        s = r & 65535;
                        b[q >> 1] = s;
                        if ((o | 0) > 11) {
                            s = f + 20 | 0;
                            t = c[s >> 2] | 0;
                            c[s >> 2] = t + 1;
                            u = f + 8 | 0;
                            a[(c[u >> 2] | 0) + t >> 0] = r;
                            t = (e[q >> 1] | 0) >>> 8 & 255;
                            o = c[s >> 2] | 0;
                            c[s >> 2] = o + 1;
                            a[(c[u >> 2] | 0) + o >> 0] = t;
                            o = c[h >> 2] | 0;
                            u = p >>> (16 - o | 0) & 65535;
                            b[q >> 1] = u;
                            q = u;
                            o = o + -11 | 0
                        } else {
                            q = s;
                            o = o + 5 | 0
                        }
                        c[h >> 2] = o;
                        n = n + 65533 & 65535;
                        p = f + 5816 | 0;
                        q = q & 65535 | n << o;
                        t = q & 65535;
                        b[p >> 1] = t;
                        if ((o | 0) > 12) {
                            o = f + 20 | 0;
                            t = c[o >> 2] | 0;
                            c[o >> 2] = t + 1;
                            u = f + 8 | 0;
                            a[(c[u >> 2] | 0) + t >> 0] = q;
                            t = (e[p >> 1] | 0) >>> 8 & 255;
                            r = c[o >> 2] | 0;
                            c[o >> 2] = r + 1;
                            a[(c[u >> 2] | 0) + r >> 0] = t;
                            r = c[h >> 2] | 0;
                            t = n >>> (16 - r | 0) & 65535;
                            b[p >> 1] = t;
                            r = r + -12 | 0;
                            c[h >> 2] = r;
                            n = u
                        } else {
                            r = o + 4 | 0;
                            c[h >> 2] = r;
                            n = f + 8 | 0;
                            o = f + 20 | 0
                        }
                        p = f + 5816 | 0;
                        q = 0;
                        while (1) {
                            if ((q | 0) >= (g | 0)) {
                                break
                            }
                            s = e[f + (d[5776 + q >> 0] << 2) + 2686 >> 1] | 0;
                            u = t & 65535 | s << r;
                            t = u & 65535;
                            b[p >> 1] = t;
                            if ((r | 0) > 13) {
                                t = c[o >> 2] | 0;
                                c[o >> 2] = t + 1;
                                a[(c[n >> 2] | 0) + t >> 0] = u;
                                t = (e[p >> 1] | 0) >>> 8 & 255;
                                r = c[o >> 2] | 0;
                                c[o >> 2] = r + 1;
                                a[(c[n >> 2] | 0) + r >> 0] = t;
                                r = c[h >> 2] | 0;
                                t = s >>> (16 - r | 0) & 65535;
                                b[p >> 1] = t;
                                r = r + -13 | 0
                            } else {
                                r = r + 3 | 0
                            }
                            c[h >> 2] = r;
                            q = q + 1 | 0
                        }
                        t = f + 148 | 0;
                        lb(f, t, l);
                        u = f + 2440 | 0;
                        lb(f, u, m);
                        jb(f, t, u)
                    } else {
                        eb(f, g, h, j)
                    }
                } while (0);
                db(f);
                if ((j | 0) == 0) {
                    i = k;
                    return
                }
                kb(f);
                i = k;
                return
            }
            function ib(d, f) {
                d = d | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0;
                j = i;
                i = i + 32 | 0;
                h = j;
                g = c[f >> 2] | 0;
                p = f + 8 | 0;
                q = c[p >> 2] | 0;
                r = c[q >> 2] | 0;
                q = c[q + 12 >> 2] | 0;
                m = d + 5200 | 0;
                c[m >> 2] = 0;
                o = d + 5204 | 0;
                c[o >> 2] = 573;
                k = -1;
                l = 0;
                while (1) {
                    if ((l | 0) >= (q | 0)) {
                        break
                    }
                    if ((b[g + (l << 2) >> 1] | 0) == 0) {
                        b[g + (l << 2) + 2 >> 1] = 0
                    } else {
                        k = (c[m >> 2] | 0) + 1 | 0;
                        c[m >> 2] = k;
                        c[d + (k << 2) + 2908 >> 2] = l;
                        a[d + l + 5208 >> 0] = 0;
                        k = l
                    }
                    l = l + 1 | 0
                }
                l = d + 5800 | 0;
                s = (r | 0) == 0;
                n = d + 5804 | 0;
                while (1) {
                    t = c[m >> 2] | 0;
                    if ((t | 0) >= 2) {
                        break
                    }
                    y = (k | 0) < 2;
                    u = k + 1 | 0;
                    k = y ? u : k;
                    u = y ? u : 0;
                    y = t + 1 | 0;
                    c[m >> 2] = y;
                    c[d + (y << 2) + 2908 >> 2] = u;
                    b[g + (u << 2) >> 1] = 1;
                    a[d + u + 5208 >> 0] = 0;
                    c[l >> 2] = (c[l >> 2] | 0) + -1;
                    if (s) {
                        continue
                    }
                    c[n >> 2] = (c[n >> 2] | 0) - (e[r + (u << 2) + 2 >> 1] | 0)
                }
                r = f + 4 | 0;
                c[r >> 2] = k;
                s = (c[m >> 2] | 0) / 2 | 0;
                while (1) {
                    if ((s | 0) <= 0) {
                        break
                    }
                    nb(d, g, s);
                    s = s + -1 | 0
                }
                t = d + 2912 | 0;
                s = c[m >> 2] | 0;
                while (1) {
                    y = c[t >> 2] | 0;
                    c[m >> 2] = s + -1;
                    c[t >> 2] = c[d + (s << 2) + 2908 >> 2];
                    nb(d, g, 1);
                    w = c[t >> 2] | 0;
                    x = (c[o >> 2] | 0) + -1 | 0;
                    c[o >> 2] = x;
                    c[d + (x << 2) + 2908 >> 2] = y;
                    x = (c[o >> 2] | 0) + -1 | 0;
                    c[o >> 2] = x;
                    c[d + (x << 2) + 2908 >> 2] = w;
                    b[g + (q << 2) >> 1] = (e[g + (y << 2) >> 1] | 0) + (e[g + (w << 2) >> 1] | 0);
                    x = a[d + y + 5208 >> 0] | 0;
                    v = a[d + w + 5208 >> 0] | 0;
                    a[d + q + 5208 >> 0] = (((x & 255) < (v & 255) ? v : x) & 255) + 1;
                    x = q & 65535;
                    b[g + (w << 2) + 2 >> 1] = x;
                    b[g + (y << 2) + 2 >> 1] = x;
                    c[t >> 2] = q;
                    nb(d, g, 1);
                    s = c[m >> 2] | 0;
                    if ((s | 0) <= 1) {
                        break
                    } else {
                        q = q + 1 | 0
                    }
                }
                s = c[t >> 2] | 0;
                m = (c[o >> 2] | 0) + -1 | 0;
                c[o >> 2] = m;
                c[d + (m << 2) + 2908 >> 2] = s;
                f = c[f >> 2] | 0;
                m = c[r >> 2] | 0;
                p = c[p >> 2] | 0;
                s = c[p >> 2] | 0;
                q = c[p + 4 >> 2] | 0;
                r = c[p + 8 >> 2] | 0;
                p = c[p + 16 >> 2] | 0;
                t = 0;
                while (1) {
                    if ((t | 0) >= 16) {
                        break
                    }
                    b[d + (t << 1) + 2876 >> 1] = 0;
                    t = t + 1 | 0
                }
                b[f + (c[d + (c[o >> 2] << 2) + 2908 >> 2] << 2) + 2 >> 1] = 0;
                t = (s | 0) == 0;
                o = c[o >> 2] | 0;
                w = 0;
                while (1) {
                    o = o + 1 | 0;
                    if ((o | 0) >= 573) {
                        break
                    }
                    v = c[d + (o << 2) + 2908 >> 2] | 0;
                    y = f + (v << 2) + 2 | 0;
                    u = e[f + (e[y >> 1] << 2) + 2 >> 1] | 0;
                    x = (u | 0) < (p | 0);
                    u = x ? u + 1 | 0 : p;
                    w = x ? w : w + 1 | 0;
                    b[y >> 1] = u;
                    if ((v | 0) > (m | 0)) {
                        continue
                    }
                    y = d + (u << 1) + 2876 | 0;
                    b[y >> 1] = (b[y >> 1] | 0) + 1 << 16 >> 16;
                    if ((v | 0) < (r | 0)) {
                        x = 0
                    } else {
                        x = c[q + (v - r << 2) >> 2] | 0
                    }
                    y = e[f + (v << 2) >> 1] | 0;
                    u = Z(y, u + x | 0) | 0;
                    c[l >> 2] = (c[l >> 2] | 0) + u;
                    if (t) {
                        continue
                    }
                    y = Z(y, (e[s + (v << 2) + 2 >> 1] | 0) + x | 0) | 0;
                    c[n >> 2] = (c[n >> 2] | 0) + y
                }
                a: do {
                    if ((w | 0) != 0) {
                        n = d + (p << 1) + 2876 | 0;
                        do {
                            t = p;
                            while (1) {
                                s = t + -1 | 0;
                                q = d + (s << 1) + 2876 | 0;
                                r = b[q >> 1] | 0;
                                if (r << 16 >> 16 == 0) {
                                    t = s
                                } else {
                                    break
                                }
                            }
                            b[q >> 1] = r + -1 << 16 >> 16;
                            y = d + (t << 1) + 2876 | 0;
                            b[y >> 1] = (e[y >> 1] | 0) + 2;
                            b[n >> 1] = (b[n >> 1] | 0) + -1 << 16 >> 16;
                            w = w + -2 | 0
                        } while ((w | 0) > 0);
                        while (1) {
                            if ((p | 0) == 0) {
                                break a
                            }
                            n = p & 65535;
                            q = e[d + (p << 1) + 2876 >> 1] | 0;
                            b: while (1) {
                                r = q;
                                while (1) {
                                    if ((r | 0) == 0) {
                                        break b
                                    }
                                    o = o + -1 | 0;
                                    r = c[d + (o << 2) + 2908 >> 2] | 0;
                                    if ((r | 0) > (m | 0)) {
                                        r = q
                                    } else {
                                        break
                                    }
                                }
                                s = f + (r << 2) + 2 | 0;
                                t = e[s >> 1] | 0;
                                if ((t | 0) != (p | 0)) {
                                    y = Z(p - t | 0, e[f + (r << 2) >> 1] | 0) | 0;
                                    c[l >> 2] = (c[l >> 2] | 0) + y;
                                    b[s >> 1] = n
                                }
                                q = q + -1 | 0
                            }
                            p = p + -1 | 0
                        }
                    }
                } while (0);
                l = 0;
                f = 1;
                while (1) {
                    if ((f | 0) >= 16) {
                        d = 0;
                        break
                    }
                    y = (l & 65534) + (e[d + (f + -1 << 1) + 2876 >> 1] | 0) << 1;
                    b[h + (f << 1) >> 1] = y;
                    l = y;
                    f = f + 1 | 0
                }
                while (1) {
                    if ((d | 0) > (k | 0)) {
                        break
                    }
                    y = b[g + (d << 2) + 2 >> 1] | 0;
                    f = y & 65535;
                    if (!(y << 16 >> 16 == 0)) {
                        m = h + (f << 1) | 0;
                        l = b[m >> 1] | 0;
                        b[m >> 1] = l + 1 << 16 >> 16;
                        l = l & 65535;
                        m = 0;
                        while (1) {
                            m = m | l & 1;
                            f = f + -1 | 0;
                            if ((f | 0) <= 0) {
                                break
                            } else {
                                l = l >>> 1;
                                m = m << 1
                            }
                        }
                        b[g + (d << 2) >> 1] = m
                    }
                    d = d + 1 | 0
                }
                i = j;
                return
            }
            function jb(f, g, h) {
                f = f | 0;
                g = g | 0;
                h = h | 0;
                var j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0;
                j = i;
                o = f + 5792 | 0;
                if ((c[o >> 2] | 0) == 0) {
                    v = c[f + 5820 >> 2] | 0
                } else {
                    r = f + 5796 | 0;
                    p = f + 5784 | 0;
                    n = f + 5820 | 0;
                    m = f + 5816 | 0;
                    k = f + 20 | 0;
                    l = f + 8 | 0;
                    q = 0;
                    do {
                        z = b[(c[r >> 2] | 0) + (q << 1) >> 1] | 0;
                        s = z & 65535;
                        u = d[(c[p >> 2] | 0) + q >> 0] | 0;
                        q = q + 1 | 0;
                        do {
                            if (z << 16 >> 16 == 0) {
                                t = e[g + (u << 2) + 2 >> 1] | 0;
                                s = c[n >> 2] | 0;
                                u = e[g + (u << 2) >> 1] | 0;
                                v = e[m >> 1] | 0 | u << s;
                                b[m >> 1] = v;
                                if ((s | 0) > (16 - t | 0)) {
                                    z = c[k >> 2] | 0;
                                    c[k >> 2] = z + 1;
                                    a[(c[l >> 2] | 0) + z >> 0] = v;
                                    z = (e[m >> 1] | 0) >>> 8 & 255;
                                    v = c[k >> 2] | 0;
                                    c[k >> 2] = v + 1;
                                    a[(c[l >> 2] | 0) + v >> 0] = z;
                                    v = c[n >> 2] | 0;
                                    b[m >> 1] = u >>> (16 - v | 0);
                                    v = v + (t + -16) | 0;
                                    c[n >> 2] = v;
                                    break
                                } else {
                                    v = s + t | 0;
                                    c[n >> 2] = v;
                                    break
                                }
                            } else {
                                v = d[3696 + u >> 0] | 0;
                                t = e[g + ((v | 256) + 1 << 2) + 2 >> 1] | 0;
                                x = c[n >> 2] | 0;
                                y = e[g + (v + 257 << 2) >> 1] | 0;
                                z = e[m >> 1] | 0 | y << x;
                                w = z & 65535;
                                b[m >> 1] = w;
                                if ((x | 0) > (16 - t | 0)) {
                                    w = c[k >> 2] | 0;
                                    c[k >> 2] = w + 1;
                                    a[(c[l >> 2] | 0) + w >> 0] = z;
                                    w = (e[m >> 1] | 0) >>> 8 & 255;
                                    z = c[k >> 2] | 0;
                                    c[k >> 2] = z + 1;
                                    a[(c[l >> 2] | 0) + z >> 0] = w;
                                    z = c[n >> 2] | 0;
                                    w = y >>> (16 - z | 0) & 65535;
                                    b[m >> 1] = w;
                                    t = z + (t + -16) | 0
                                } else {
                                    t = x + t | 0
                                }
                                c[n >> 2] = t;
                                x = c[5296 + (v << 2) >> 2] | 0;
                                do {
                                    if ((v + -8 | 0) >>> 0 < 20) {
                                        u = u - (c[5416 + (v << 2) >> 2] | 0) & 65535;
                                        v = w & 65535 | u << t;
                                        w = v & 65535;
                                        b[m >> 1] = w;
                                        if ((t | 0) > (16 - x | 0)) {
                                            w = c[k >> 2] | 0;
                                            c[k >> 2] = w + 1;
                                            a[(c[l >> 2] | 0) + w >> 0] = v;
                                            w = (e[m >> 1] | 0) >>> 8 & 255;
                                            t = c[k >> 2] | 0;
                                            c[k >> 2] = t + 1;
                                            a[(c[l >> 2] | 0) + t >> 0] = w;
                                            t = c[n >> 2] | 0;
                                            w = u >>> (16 - t | 0) & 65535;
                                            b[m >> 1] = w;
                                            t = t + (x + -16) | 0;
                                            c[n >> 2] = t;
                                            break
                                        } else {
                                            t = t + x | 0;
                                            c[n >> 2] = t;
                                            break
                                        }
                                    }
                                } while (0);
                                s = s + -1 | 0;
                                if (s >>> 0 < 256) {
                                    u = a[3184 + s >> 0] | 0
                                } else {
                                    u = a[(s >>> 7) + 3440 >> 0] | 0
                                }
                                u = u & 255;
                                v = e[h + (u << 2) + 2 >> 1] | 0;
                                x = e[h + (u << 2) >> 1] | 0;
                                y = w & 65535 | x << t;
                                w = y & 65535;
                                b[m >> 1] = w;
                                if ((t | 0) > (16 - v | 0)) {
                                    w = c[k >> 2] | 0;
                                    c[k >> 2] = w + 1;
                                    a[(c[l >> 2] | 0) + w >> 0] = y;
                                    w = (e[m >> 1] | 0) >>> 8 & 255;
                                    z = c[k >> 2] | 0;
                                    c[k >> 2] = z + 1;
                                    a[(c[l >> 2] | 0) + z >> 0] = w;
                                    z = c[n >> 2] | 0;
                                    w = x >>> (16 - z | 0) & 65535;
                                    b[m >> 1] = w;
                                    v = z + (v + -16) | 0
                                } else {
                                    v = t + v | 0
                                }
                                c[n >> 2] = v;
                                t = c[5536 + (u << 2) >> 2] | 0;
                                if ((u + -4 | 0) >>> 0 < 26) {
                                    s = s - (c[5656 + (u << 2) >> 2] | 0) & 65535;
                                    u = w & 65535 | s << v;
                                    b[m >> 1] = u;
                                    if ((v | 0) > (16 - t | 0)) {
                                        z = c[k >> 2] | 0;
                                        c[k >> 2] = z + 1;
                                        a[(c[l >> 2] | 0) + z >> 0] = u;
                                        z = (e[m >> 1] | 0) >>> 8 & 255;
                                        v = c[k >> 2] | 0;
                                        c[k >> 2] = v + 1;
                                        a[(c[l >> 2] | 0) + v >> 0] = z;
                                        v = c[n >> 2] | 0;
                                        b[m >> 1] = s >>> (16 - v | 0);
                                        v = v + (t + -16) | 0;
                                        c[n >> 2] = v;
                                        break
                                    } else {
                                        v = v + t | 0;
                                        c[n >> 2] = v;
                                        break
                                    }
                                }
                            }
                        } while (0)
                    } while (q >>> 0 < (c[o >> 2] | 0) >>> 0)
                }
                k = e[g + 1026 >> 1] | 0;
                h = f + 5820 | 0;
                g = e[g + 1024 >> 1] | 0;
                l = f + 5816 | 0;
                m = e[l >> 1] | 0 | g << v;
                b[l >> 1] = m;
                if ((v | 0) > (16 - k | 0)) {
                    w = f + 20 | 0;
                    x = c[w >> 2] | 0;
                    c[w >> 2] = x + 1;
                    y = f + 8 | 0;
                    a[(c[y >> 2] | 0) + x >> 0] = m;
                    x = (e[l >> 1] | 0) >>> 8 & 255;
                    z = c[w >> 2] | 0;
                    c[w >> 2] = z + 1;
                    a[(c[y >> 2] | 0) + z >> 0] = x;
                    z = c[h >> 2] | 0;
                    b[l >> 1] = g >>> (16 - z | 0);
                    z = z + (k + -16) | 0;
                    c[h >> 2] = z;
                    i = j;
                    return
                } else {
                    z = v + k | 0;
                    c[h >> 2] = z;
                    i = j;
                    return
                }
            }
            function kb(d) {
                d = d | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0;
                f = i;
                g = d + 5820 | 0;
                h = c[g >> 2] | 0;
                if ((h | 0) > 8) {
                    j = d + 5816 | 0;
                    h = b[j >> 1] & 255;
                    l = d + 20 | 0;
                    k = c[l >> 2] | 0;
                    c[l >> 2] = k + 1;
                    d = d + 8 | 0;
                    a[(c[d >> 2] | 0) + k >> 0] = h;
                    k = (e[j >> 1] | 0) >>> 8 & 255;
                    h = c[l >> 2] | 0;
                    c[l >> 2] = h + 1;
                    a[(c[d >> 2] | 0) + h >> 0] = k;
                    b[j >> 1] = 0;
                    c[g >> 2] = 0;
                    i = f;
                    return
                }
                j = d + 5816 | 0;
                if ((h | 0) <= 0) {
                    l = j;
                    b[l >> 1] = 0;
                    c[g >> 2] = 0;
                    i = f;
                    return
                }
                k = b[j >> 1] & 255;
                h = d + 20 | 0;
                l = c[h >> 2] | 0;
                c[h >> 2] = l + 1;
                a[(c[d + 8 >> 2] | 0) + l >> 0] = k;
                l = j;
                b[l >> 1] = 0;
                c[g >> 2] = 0;
                i = f;
                return
            }
            function lb(d, f, g) {
                d = d | 0;
                f = f | 0;
                g = g | 0;
                var h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0;
                p = i;
                h = b[f + 2 >> 1] | 0;
                A = h << 16 >> 16 == 0;
                q = d + 2754 | 0;
                j = d + 5820 | 0;
                r = d + 2752 | 0;
                k = d + 5816 | 0;
                n = d + 20 | 0;
                o = d + 8 | 0;
                s = d + 2758 | 0;
                t = d + 2756 | 0;
                l = d + 2750 | 0;
                m = d + 2748 | 0;
                x = 0;
                y = A ? 138 : 7;
                A = A ? 3 : 4;
                h = h & 65535;
                B = -1;
                u = 0;
                while (1) {
                    if ((u | 0) > (g | 0)) {
                        break
                    }
                    u = u + 1 | 0;
                    w = b[f + (u << 2) + 2 >> 1] | 0;
                    v = w & 65535;
                    z = x + 1 | 0;
                    if ((z | 0) < (y | 0) & (h | 0) == (v | 0)) {
                        D = B;
                        x = z;
                        h = v;
                        B = D;
                        continue
                    }
                    do {
                        if ((z | 0) >= (A | 0)) {
                            if ((h | 0) != 0) {
                                if ((h | 0) == (B | 0)) {
                                    y = c[j >> 2] | 0;
                                    x = z
                                } else {
                                    B = e[d + (h << 2) + 2686 >> 1] | 0;
                                    A = c[j >> 2] | 0;
                                    y = e[d + (h << 2) + 2684 >> 1] | 0;
                                    z = e[k >> 1] | 0 | y << A;
                                    b[k >> 1] = z;
                                    if ((A | 0) > (16 - B | 0)) {
                                        C = c[n >> 2] | 0;
                                        c[n >> 2] = C + 1;
                                        a[(c[o >> 2] | 0) + C >> 0] = z;
                                        C = (e[k >> 1] | 0) >>> 8 & 255;
                                        D = c[n >> 2] | 0;
                                        c[n >> 2] = D + 1;
                                        a[(c[o >> 2] | 0) + D >> 0] = C;
                                        D = c[j >> 2] | 0;
                                        b[k >> 1] = y >>> (16 - D | 0);
                                        y = D + (B + -16) | 0
                                    } else {
                                        y = A + B | 0
                                    }
                                    c[j >> 2] = y
                                }
                                z = e[l >> 1] | 0;
                                A = e[m >> 1] | 0;
                                C = e[k >> 1] | 0 | A << y;
                                B = C & 65535;
                                b[k >> 1] = B;
                                if ((y | 0) > (16 - z | 0)) {
                                    B = c[n >> 2] | 0;
                                    c[n >> 2] = B + 1;
                                    a[(c[o >> 2] | 0) + B >> 0] = C;
                                    B = (e[k >> 1] | 0) >>> 8 & 255;
                                    y = c[n >> 2] | 0;
                                    c[n >> 2] = y + 1;
                                    a[(c[o >> 2] | 0) + y >> 0] = B;
                                    y = c[j >> 2] | 0;
                                    B = A >>> (16 - y | 0) & 65535;
                                    b[k >> 1] = B;
                                    y = y + (z + -16) | 0
                                } else {
                                    y = y + z | 0
                                }
                                c[j >> 2] = y;
                                x = x + 65533 & 65535;
                                z = B & 65535 | x << y;
                                b[k >> 1] = z;
                                if ((y | 0) > 14) {
                                    C = c[n >> 2] | 0;
                                    c[n >> 2] = C + 1;
                                    a[(c[o >> 2] | 0) + C >> 0] = z;
                                    C = (e[k >> 1] | 0) >>> 8 & 255;
                                    D = c[n >> 2] | 0;
                                    c[n >> 2] = D + 1;
                                    a[(c[o >> 2] | 0) + D >> 0] = C;
                                    D = c[j >> 2] | 0;
                                    b[k >> 1] = x >>> (16 - D | 0);
                                    c[j >> 2] = D + -14;
                                    break
                                } else {
                                    c[j >> 2] = y + 2;
                                    break
                                }
                            }
                            if ((z | 0) < 11) {
                                z = e[q >> 1] | 0;
                                y = c[j >> 2] | 0;
                                A = e[r >> 1] | 0;
                                B = e[k >> 1] | 0 | A << y;
                                C = B & 65535;
                                b[k >> 1] = C;
                                if ((y | 0) > (16 - z | 0)) {
                                    C = c[n >> 2] | 0;
                                    c[n >> 2] = C + 1;
                                    a[(c[o >> 2] | 0) + C >> 0] = B;
                                    C = (e[k >> 1] | 0) >>> 8 & 255;
                                    y = c[n >> 2] | 0;
                                    c[n >> 2] = y + 1;
                                    a[(c[o >> 2] | 0) + y >> 0] = C;
                                    y = c[j >> 2] | 0;
                                    C = A >>> (16 - y | 0) & 65535;
                                    b[k >> 1] = C;
                                    y = y + (z + -16) | 0
                                } else {
                                    y = y + z | 0
                                }
                                c[j >> 2] = y;
                                x = x + 65534 & 65535;
                                z = C & 65535 | x << y;
                                b[k >> 1] = z;
                                if ((y | 0) > 13) {
                                    C = c[n >> 2] | 0;
                                    c[n >> 2] = C + 1;
                                    a[(c[o >> 2] | 0) + C >> 0] = z;
                                    C = (e[k >> 1] | 0) >>> 8 & 255;
                                    D = c[n >> 2] | 0;
                                    c[n >> 2] = D + 1;
                                    a[(c[o >> 2] | 0) + D >> 0] = C;
                                    D = c[j >> 2] | 0;
                                    b[k >> 1] = x >>> (16 - D | 0);
                                    c[j >> 2] = D + -13;
                                    break
                                } else {
                                    c[j >> 2] = y + 3;
                                    break
                                }
                            } else {
                                z = e[s >> 1] | 0;
                                y = c[j >> 2] | 0;
                                B = e[t >> 1] | 0;
                                C = e[k >> 1] | 0 | B << y;
                                A = C & 65535;
                                b[k >> 1] = A;
                                if ((y | 0) > (16 - z | 0)) {
                                    A = c[n >> 2] | 0;
                                    c[n >> 2] = A + 1;
                                    a[(c[o >> 2] | 0) + A >> 0] = C;
                                    A = (e[k >> 1] | 0) >>> 8 & 255;
                                    y = c[n >> 2] | 0;
                                    c[n >> 2] = y + 1;
                                    a[(c[o >> 2] | 0) + y >> 0] = A;
                                    y = c[j >> 2] | 0;
                                    A = B >>> (16 - y | 0) & 65535;
                                    b[k >> 1] = A;
                                    y = y + (z + -16) | 0
                                } else {
                                    y = y + z | 0
                                }
                                c[j >> 2] = y;
                                x = x + 65526 & 65535;
                                z = A & 65535 | x << y;
                                b[k >> 1] = z;
                                if ((y | 0) > 9) {
                                    C = c[n >> 2] | 0;
                                    c[n >> 2] = C + 1;
                                    a[(c[o >> 2] | 0) + C >> 0] = z;
                                    C = (e[k >> 1] | 0) >>> 8 & 255;
                                    D = c[n >> 2] | 0;
                                    c[n >> 2] = D + 1;
                                    a[(c[o >> 2] | 0) + D >> 0] = C;
                                    D = c[j >> 2] | 0;
                                    b[k >> 1] = x >>> (16 - D | 0);
                                    c[j >> 2] = D + -9;
                                    break
                                } else {
                                    c[j >> 2] = y + 7;
                                    break
                                }
                            }
                        } else {
                            x = d + (h << 2) + 2686 | 0;
                            y = d + (h << 2) + 2684 | 0;
                            A = c[j >> 2] | 0;
                            do {
                                B = e[x >> 1] | 0;
                                D = e[y >> 1] | 0;
                                C = e[k >> 1] | 0 | D << A;
                                b[k >> 1] = C;
                                if ((A | 0) > (16 - B | 0)) {
                                    A = c[n >> 2] | 0;
                                    c[n >> 2] = A + 1;
                                    a[(c[o >> 2] | 0) + A >> 0] = C;
                                    C = (e[k >> 1] | 0) >>> 8 & 255;
                                    A = c[n >> 2] | 0;
                                    c[n >> 2] = A + 1;
                                    a[(c[o >> 2] | 0) + A >> 0] = C;
                                    A = c[j >> 2] | 0;
                                    b[k >> 1] = D >>> (16 - A | 0);
                                    A = A + (B + -16) | 0
                                } else {
                                    A = A + B | 0
                                }
                                c[j >> 2] = A;
                                z = z + -1 | 0
                            } while ((z | 0) != 0)
                        }
                    } while (0);
                    if (w << 16 >> 16 == 0) {
                        B = h;
                        x = 0;
                        y = 138;
                        A = 3;
                        h = v;
                        continue
                    }
                    A = (h | 0) == (v | 0);
                    B = h;
                    x = 0;
                    y = A ? 6 : 7;
                    A = A ? 3 : 4;
                    h = v
                }
                i = p;
                return
            }
            function mb(a, c, d) {
                a = a | 0;
                c = c | 0;
                d = d | 0;
                var f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
                n = i;
                f = b[c + 2 >> 1] | 0;
                h = f << 16 >> 16 == 0;
                b[c + (d + 1 << 2) + 2 >> 1] = -1;
                j = a + 2752 | 0;
                k = a + 2756 | 0;
                m = a + 2748 | 0;
                o = 0;
                g = h ? 138 : 7;
                h = h ? 3 : 4;
                f = f & 65535;
                l = -1;
                p = 0;
                while (1) {
                    if ((p | 0) > (d | 0)) {
                        break
                    }
                    p = p + 1 | 0;
                    r = b[c + (p << 2) + 2 >> 1] | 0;
                    q = r & 65535;
                    o = o + 1 | 0;
                    if ((o | 0) < (g | 0) & (f | 0) == (q | 0)) {
                        r = l;
                        f = q;
                        l = r;
                        continue
                    }
                    do {
                        if ((o | 0) >= (h | 0)) {
                            if ((f | 0) == 0) {
                                if ((o | 0) < 11) {
                                    b[j >> 1] = (b[j >> 1] | 0) + 1 << 16 >> 16;
                                    break
                                } else {
                                    b[k >> 1] = (b[k >> 1] | 0) + 1 << 16 >> 16;
                                    break
                                }
                            } else {
                                if ((f | 0) != (l | 0)) {
                                    o = a + (f << 2) + 2684 | 0;
                                    b[o >> 1] = (b[o >> 1] | 0) + 1 << 16 >> 16
                                }
                                b[m >> 1] = (b[m >> 1] | 0) + 1 << 16 >> 16;
                                break
                            }
                        } else {
                            l = a + (f << 2) + 2684 | 0;
                            b[l >> 1] = (e[l >> 1] | 0) + o
                        }
                    } while (0);
                    if (r << 16 >> 16 == 0) {
                        l = f;
                        o = 0;
                        g = 138;
                        h = 3;
                        f = q;
                        continue
                    }
                    h = (f | 0) == (q | 0);
                    l = f;
                    o = 0;
                    g = h ? 6 : 7;
                    h = h ? 3 : 4;
                    f = q
                }
                i = n;
                return
            }
            function nb(a, e, f) {
                a = a | 0;
                e = e | 0;
                f = f | 0;
                var g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0;
                g = i;
                h = c[a + (f << 2) + 2908 >> 2] | 0;
                k = a + h + 5208 | 0;
                l = a + 5200 | 0;
                j = e + (h << 2) | 0;
                while (1) {
                    m = f << 1;
                    n = c[l >> 2] | 0;
                    if ((m | 0) > (n | 0)) {
                        j = 12;
                        break
                    }
                    do {
                        if ((m | 0) < (n | 0)) {
                            r = m | 1;
                            q = c[a + (r << 2) + 2908 >> 2] | 0;
                            n = b[e + (q << 2) >> 1] | 0;
                            p = c[a + (m << 2) + 2908 >> 2] | 0;
                            o = b[e + (p << 2) >> 1] | 0;
                            if (!((n & 65535) < (o & 65535))) {
                                if (!(n << 16 >> 16 == o << 16 >> 16)) {
                                    break
                                }
                                if ((d[a + q + 5208 >> 0] | 0) > (d[a + p + 5208 >> 0] | 0)) {
                                    break
                                }
                            }
                            m = r
                        }
                    } while (0);
                    o = b[j >> 1] | 0;
                    p = c[a + (m << 2) + 2908 >> 2] | 0;
                    n = b[e + (p << 2) >> 1] | 0;
                    if ((o & 65535) < (n & 65535)) {
                        j = 12;
                        break
                    }
                    if (o << 16 >> 16 == n << 16 >> 16 ? (d[k >> 0] | 0) <= (d[a + p + 5208 >> 0] | 0) : 0) {
                        j = 12;
                        break
                    }
                    c[a + (f << 2) + 2908 >> 2] = p;
                    f = m
                }
                if ((j | 0) == 12) {
                    c[a + (f << 2) + 2908 >> 2] = h;
                    i = g;
                    return
                }
            }
            function ob(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                var d = 0;
                d = i;
                a = sb(Z(b, c) | 0) | 0;
                i = d;
                return a | 0
            }
            function pb(a, b) {
                a = a | 0;
                b = b | 0;
                a = i;
                tb(b);
                i = a;
                return
            }
            function qb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                var e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                e = i;
                f = a >>> 16;
                a = a & 65535;
                if ((c | 0) == 1) {
                    b = a + (d[b >> 0] | 0) | 0;
                    b = b >>> 0 > 65520 ? b + -65521 | 0 : b;
                    g = f + b | 0;
                    g = b | (g >>> 0 > 65520 ? g + -65521 | 0 : g) << 16;
                    i = e;
                    return g | 0
                }
                if ((b | 0) == 0) {
                    g = 1;
                    i = e;
                    return g | 0
                }
                if (c >>> 0 < 16) {
                    while (1) {
                        if ((c | 0) == 0) {
                            break
                        }
                        g = a + (d[b >> 0] | 0) | 0;
                        b = b + 1 | 0;
                        a = g;
                        c = c + -1 | 0;
                        f = f + g | 0
                    }
                    g = (a >>> 0 > 65520 ? a + -65521 | 0 : a) | ((f >>> 0) % 65521 | 0) << 16;
                    i = e;
                    return g | 0
                }
                while (1) {
                    if (!(c >>> 0 > 5551)) {
                        break
                    }
                    c = c + -5552 | 0;
                    g = 347;
                    do {
                        w = a + (d[b >> 0] | 0) | 0;
                        v = w + (d[b + 1 >> 0] | 0) | 0;
                        u = v + (d[b + 2 >> 0] | 0) | 0;
                        t = u + (d[b + 3 >> 0] | 0) | 0;
                        s = t + (d[b + 4 >> 0] | 0) | 0;
                        r = s + (d[b + 5 >> 0] | 0) | 0;
                        q = r + (d[b + 6 >> 0] | 0) | 0;
                        p = q + (d[b + 7 >> 0] | 0) | 0;
                        o = p + (d[b + 8 >> 0] | 0) | 0;
                        n = o + (d[b + 9 >> 0] | 0) | 0;
                        m = n + (d[b + 10 >> 0] | 0) | 0;
                        l = m + (d[b + 11 >> 0] | 0) | 0;
                        k = l + (d[b + 12 >> 0] | 0) | 0;
                        j = k + (d[b + 13 >> 0] | 0) | 0;
                        h = j + (d[b + 14 >> 0] | 0) | 0;
                        a = h + (d[b + 15 >> 0] | 0) | 0;
                        f = f + w + v + u + t + s + r + q + p + o + n + m + l + k + j + h + a | 0;
                        b = b + 16 | 0;
                        g = g + -1 | 0
                    } while ((g | 0) != 0);
                    a = (a >>> 0) % 65521 | 0;
                    f = (f >>> 0) % 65521 | 0
                }
                if ((c | 0) != 0) {
                    while (1) {
                        if (!(c >>> 0 > 15)) {
                            break
                        }
                        g = a + (d[b >> 0] | 0) | 0;
                        h = g + (d[b + 1 >> 0] | 0) | 0;
                        j = h + (d[b + 2 >> 0] | 0) | 0;
                        k = j + (d[b + 3 >> 0] | 0) | 0;
                        l = k + (d[b + 4 >> 0] | 0) | 0;
                        m = l + (d[b + 5 >> 0] | 0) | 0;
                        n = m + (d[b + 6 >> 0] | 0) | 0;
                        o = n + (d[b + 7 >> 0] | 0) | 0;
                        p = o + (d[b + 8 >> 0] | 0) | 0;
                        q = p + (d[b + 9 >> 0] | 0) | 0;
                        r = q + (d[b + 10 >> 0] | 0) | 0;
                        s = r + (d[b + 11 >> 0] | 0) | 0;
                        t = s + (d[b + 12 >> 0] | 0) | 0;
                        u = t + (d[b + 13 >> 0] | 0) | 0;
                        v = u + (d[b + 14 >> 0] | 0) | 0;
                        w = v + (d[b + 15 >> 0] | 0) | 0;
                        c = c + -16 | 0;
                        b = b + 16 | 0;
                        a = w;
                        f = f + g + h + j + k + l + m + n + o + p + q + r + s + t + u + v + w | 0
                    }
                    while (1) {
                        if ((c | 0) == 0) {
                            break
                        }
                        w = a + (d[b >> 0] | 0) | 0;
                        c = c + -1 | 0;
                        b = b + 1 | 0;
                        a = w;
                        f = f + w | 0
                    }
                    a = (a >>> 0) % 65521 | 0;
                    f = (f >>> 0) % 65521 | 0
                }
                w = a | f << 16;
                i = e;
                return w | 0
            }
            function rb(a, b, e) {
                a = a | 0;
                b = b | 0;
                e = e | 0;
                var f = 0, g = 0;
                f = i;
                if ((b | 0) == 0) {
                    a = 0;
                    i = f;
                    return a | 0
                }
                a = ~a;
                while (1) {
                    if ((e | 0) == 0) {
                        break
                    }
                    if ((b & 3 | 0) == 0) {
                        break
                    }
                    g = c[5936 + ((a & 255 ^ (d[b >> 0] | 0)) << 2) >> 2] ^ a >>> 8;
                    b = b + 1 | 0;
                    e = e + -1 | 0;
                    a = g
                }
                while (1) {
                    if (!(e >>> 0 > 31)) {
                        break
                    }
                    g = a ^ c[b >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 4 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 8 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 12 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 16 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 20 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 24 >> 2];
                    g = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2] ^ c[b + 28 >> 2];
                    e = e + -32 | 0;
                    b = b + 32 | 0;
                    a = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2]
                }
                while (1) {
                    if (!(e >>> 0 > 3)) {
                        break
                    }
                    g = a ^ c[b >> 2];
                    e = e + -4 | 0;
                    b = b + 4 | 0;
                    a = c[9008 + ((g & 255) << 2) >> 2] ^ c[7984 + ((g >>> 8 & 255) << 2) >> 2] ^ c[6960 + ((g >>> 16 & 255) << 2) >> 2] ^ c[5936 + (g >>> 24 << 2) >> 2]
                }
                if ((e | 0) != 0) {
                    while (1) {
                        a = c[5936 + ((a & 255 ^ (d[b >> 0] | 0)) << 2) >> 2] ^ a >>> 8;
                        e = e + -1 | 0;
                        if ((e | 0) == 0) {
                            break
                        } else {
                            b = b + 1 | 0
                        }
                    }
                }
                g = ~a;
                i = f;
                return g | 0
            }
            function sb(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0, x = 0, y = 0, z = 0, A = 0, B = 0, C = 0, D = 0, E = 0, F = 0, G = 0, H = 0;
                b = i;
                do {
                    if (a >>> 0 < 245) {
                        if (a >>> 0 < 11) {
                            a = 16
                        } else {
                            a = a + 11 & -8
                        }
                        v = a >>> 3;
                        p = c[3554] | 0;
                        w = p >>> v;
                        if ((w & 3 | 0) != 0) {
                            h = (w & 1 ^ 1) + v | 0;
                            g = h << 1;
                            e = 14256 + (g << 2) | 0;
                            g = 14256 + (g + 2 << 2) | 0;
                            j = c[g >> 2] | 0;
                            d = j + 8 | 0;
                            f = c[d >> 2] | 0;
                            do {
                                if ((e | 0) != (f | 0)) {
                                    if (f >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    }
                                    k = f + 12 | 0;
                                    if ((c[k >> 2] | 0) == (j | 0)) {
                                        c[k >> 2] = e;
                                        c[g >> 2] = f;
                                        break
                                    } else {
                                        Ca()
                                    }
                                } else {
                                    c[3554] = p & ~(1 << h)
                                }
                            } while (0);
                            H = h << 3;
                            c[j + 4 >> 2] = H | 3;
                            H = j + (H | 4) | 0;
                            c[H >> 2] = c[H >> 2] | 1;
                            H = d;
                            i = b;
                            return H | 0
                        }
                        if (a >>> 0 > (c[14224 >> 2] | 0) >>> 0) {
                            if ((w | 0) != 0) {
                                h = 2 << v;
                                h = w << v & (h | 0 - h);
                                h = (h & 0 - h) + -1 | 0;
                                d = h >>> 12 & 16;
                                h = h >>> d;
                                f = h >>> 5 & 8;
                                h = h >>> f;
                                g = h >>> 2 & 4;
                                h = h >>> g;
                                e = h >>> 1 & 2;
                                h = h >>> e;
                                j = h >>> 1 & 1;
                                j = (f | d | g | e | j) + (h >>> j) | 0;
                                h = j << 1;
                                e = 14256 + (h << 2) | 0;
                                h = 14256 + (h + 2 << 2) | 0;
                                g = c[h >> 2] | 0;
                                d = g + 8 | 0;
                                f = c[d >> 2] | 0;
                                do {
                                    if ((e | 0) != (f | 0)) {
                                        if (f >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                            Ca()
                                        }
                                        k = f + 12 | 0;
                                        if ((c[k >> 2] | 0) == (g | 0)) {
                                            c[k >> 2] = e;
                                            c[h >> 2] = f;
                                            break
                                        } else {
                                            Ca()
                                        }
                                    } else {
                                        c[3554] = p & ~(1 << j)
                                    }
                                } while (0);
                                h = j << 3;
                                f = h - a | 0;
                                c[g + 4 >> 2] = a | 3;
                                e = g + a | 0;
                                c[g + (a | 4) >> 2] = f | 1;
                                c[g + h >> 2] = f;
                                h = c[14224 >> 2] | 0;
                                if ((h | 0) != 0) {
                                    g = c[14236 >> 2] | 0;
                                    k = h >>> 3;
                                    j = k << 1;
                                    h = 14256 + (j << 2) | 0;
                                    l = c[3554] | 0;
                                    k = 1 << k;
                                    if ((l & k | 0) != 0) {
                                        j = 14256 + (j + 2 << 2) | 0;
                                        k = c[j >> 2] | 0;
                                        if (k >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                            Ca()
                                        } else {
                                            D = j;
                                            C = k
                                        }
                                    } else {
                                        c[3554] = l | k;
                                        D = 14256 + (j + 2 << 2) | 0;
                                        C = h
                                    }
                                    c[D >> 2] = g;
                                    c[C + 12 >> 2] = g;
                                    c[g + 8 >> 2] = C;
                                    c[g + 12 >> 2] = h
                                }
                                c[14224 >> 2] = f;
                                c[14236 >> 2] = e;
                                H = d;
                                i = b;
                                return H | 0
                            }
                            p = c[14220 >> 2] | 0;
                            if ((p | 0) != 0) {
                                e = (p & 0 - p) + -1 | 0;
                                G = e >>> 12 & 16;
                                e = e >>> G;
                                F = e >>> 5 & 8;
                                e = e >>> F;
                                H = e >>> 2 & 4;
                                e = e >>> H;
                                f = e >>> 1 & 2;
                                e = e >>> f;
                                d = e >>> 1 & 1;
                                d = c[14520 + ((F | G | H | f | d) + (e >>> d) << 2) >> 2] | 0;
                                e = (c[d + 4 >> 2] & -8) - a | 0;
                                f = d;
                                while (1) {
                                    g = c[f + 16 >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        g = c[f + 20 >> 2] | 0;
                                        if ((g | 0) == 0) {
                                            break
                                        }
                                    }
                                    f = (c[g + 4 >> 2] & -8) - a | 0;
                                    H = f >>> 0 < e >>> 0;
                                    e = H ? f : e;
                                    f = g;
                                    d = H ? g : d
                                }
                                h = c[14232 >> 2] | 0;
                                if (d >>> 0 < h >>> 0) {
                                    Ca()
                                }
                                f = d + a | 0;
                                if (!(d >>> 0 < f >>> 0)) {
                                    Ca()
                                }
                                g = c[d + 24 >> 2] | 0;
                                k = c[d + 12 >> 2] | 0;
                                do {
                                    if ((k | 0) == (d | 0)) {
                                        k = d + 20 | 0;
                                        j = c[k >> 2] | 0;
                                        if ((j | 0) == 0) {
                                            k = d + 16 | 0;
                                            j = c[k >> 2] | 0;
                                            if ((j | 0) == 0) {
                                                B = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            l = j + 20 | 0;
                                            m = c[l >> 2] | 0;
                                            if ((m | 0) != 0) {
                                                j = m;
                                                k = l;
                                                continue
                                            }
                                            m = j + 16 | 0;
                                            l = c[m >> 2] | 0;
                                            if ((l | 0) == 0) {
                                                break
                                            } else {
                                                j = l;
                                                k = m
                                            }
                                        }
                                        if (k >>> 0 < h >>> 0) {
                                            Ca()
                                        } else {
                                            c[k >> 2] = 0;
                                            B = j;
                                            break
                                        }
                                    } else {
                                        j = c[d + 8 >> 2] | 0;
                                        if (j >>> 0 < h >>> 0) {
                                            Ca()
                                        }
                                        h = j + 12 | 0;
                                        if ((c[h >> 2] | 0) != (d | 0)) {
                                            Ca()
                                        }
                                        l = k + 8 | 0;
                                        if ((c[l >> 2] | 0) == (d | 0)) {
                                            c[h >> 2] = k;
                                            c[l >> 2] = j;
                                            B = k;
                                            break
                                        } else {
                                            Ca()
                                        }
                                    }
                                } while (0);
                                do {
                                    if ((g | 0) != 0) {
                                        h = c[d + 28 >> 2] | 0;
                                        j = 14520 + (h << 2) | 0;
                                        if ((d | 0) == (c[j >> 2] | 0)) {
                                            c[j >> 2] = B;
                                            if ((B | 0) == 0) {
                                                c[14220 >> 2] = c[14220 >> 2] & ~(1 << h);
                                                break
                                            }
                                        } else {
                                            if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                Ca()
                                            }
                                            h = g + 16 | 0;
                                            if ((c[h >> 2] | 0) == (d | 0)) {
                                                c[h >> 2] = B
                                            } else {
                                                c[g + 20 >> 2] = B
                                            }
                                            if ((B | 0) == 0) {
                                                break
                                            }
                                        }
                                        if (B >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                            Ca()
                                        }
                                        c[B + 24 >> 2] = g;
                                        g = c[d + 16 >> 2] | 0;
                                        do {
                                            if ((g | 0) != 0) {
                                                if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                    Ca()
                                                } else {
                                                    c[B + 16 >> 2] = g;
                                                    c[g + 24 >> 2] = B;
                                                    break
                                                }
                                            }
                                        } while (0);
                                        g = c[d + 20 >> 2] | 0;
                                        if ((g | 0) != 0) {
                                            if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                Ca()
                                            } else {
                                                c[B + 20 >> 2] = g;
                                                c[g + 24 >> 2] = B;
                                                break
                                            }
                                        }
                                    }
                                } while (0);
                                if (e >>> 0 < 16) {
                                    H = e + a | 0;
                                    c[d + 4 >> 2] = H | 3;
                                    H = d + (H + 4) | 0;
                                    c[H >> 2] = c[H >> 2] | 1
                                } else {
                                    c[d + 4 >> 2] = a | 3;
                                    c[d + (a | 4) >> 2] = e | 1;
                                    c[d + (e + a) >> 2] = e;
                                    h = c[14224 >> 2] | 0;
                                    if ((h | 0) != 0) {
                                        g = c[14236 >> 2] | 0;
                                        l = h >>> 3;
                                        j = l << 1;
                                        h = 14256 + (j << 2) | 0;
                                        k = c[3554] | 0;
                                        l = 1 << l;
                                        if ((k & l | 0) != 0) {
                                            j = 14256 + (j + 2 << 2) | 0;
                                            k = c[j >> 2] | 0;
                                            if (k >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                Ca()
                                            } else {
                                                A = j;
                                                z = k
                                            }
                                        } else {
                                            c[3554] = k | l;
                                            A = 14256 + (j + 2 << 2) | 0;
                                            z = h
                                        }
                                        c[A >> 2] = g;
                                        c[z + 12 >> 2] = g;
                                        c[g + 8 >> 2] = z;
                                        c[g + 12 >> 2] = h
                                    }
                                    c[14224 >> 2] = e;
                                    c[14236 >> 2] = f
                                }
                                H = d + 8 | 0;
                                i = b;
                                return H | 0
                            }
                        }
                    } else {
                        if (!(a >>> 0 > 4294967231)) {
                            z = a + 11 | 0;
                            a = z & -8;
                            B = c[14220 >> 2] | 0;
                            if ((B | 0) != 0) {
                                A = 0 - a | 0;
                                z = z >>> 8;
                                if ((z | 0) != 0) {
                                    if (a >>> 0 > 16777215) {
                                        C = 31
                                    } else {
                                        G = (z + 1048320 | 0) >>> 16 & 8;
                                        H = z << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        C = (H + 245760 | 0) >>> 16 & 2;
                                        C = 14 - (F | G | C) + (H << C >>> 15) | 0;
                                        C = a >>> (C + 7 | 0) & 1 | C << 1
                                    }
                                } else {
                                    C = 0
                                }
                                D = c[14520 + (C << 2) >> 2] | 0;
                                a: do {
                                    if ((D | 0) == 0) {
                                        F = 0;
                                        z = 0
                                    } else {
                                        if ((C | 0) == 31) {
                                            z = 0
                                        } else {
                                            z = 25 - (C >>> 1) | 0
                                        }
                                        F = 0;
                                        E = a << z;
                                        z = 0;
                                        while (1) {
                                            H = c[D + 4 >> 2] & -8;
                                            G = H - a | 0;
                                            if (G >>> 0 < A >>> 0) {
                                                if ((H | 0) == (a | 0)) {
                                                    A = G;
                                                    F = D;
                                                    z = D;
                                                    break a
                                                } else {
                                                    A = G;
                                                    z = D
                                                }
                                            }
                                            H = c[D + 20 >> 2] | 0;
                                            D = c[D + (E >>> 31 << 2) + 16 >> 2] | 0;
                                            F = (H | 0) == 0 | (H | 0) == (D | 0) ? F : H;
                                            if ((D | 0) == 0) {
                                                break
                                            } else {
                                                E = E << 1
                                            }
                                        }
                                    }
                                } while (0);
                                if ((F | 0) == 0 & (z | 0) == 0) {
                                    H = 2 << C;
                                    B = B & (H | 0 - H);
                                    if ((B | 0) == 0) {
                                        break
                                    }
                                    H = (B & 0 - B) + -1 | 0;
                                    D = H >>> 12 & 16;
                                    H = H >>> D;
                                    C = H >>> 5 & 8;
                                    H = H >>> C;
                                    E = H >>> 2 & 4;
                                    H = H >>> E;
                                    G = H >>> 1 & 2;
                                    H = H >>> G;
                                    F = H >>> 1 & 1;
                                    F = c[14520 + ((C | D | E | G | F) + (H >>> F) << 2) >> 2] | 0
                                }
                                if ((F | 0) != 0) {
                                    while (1) {
                                        H = (c[F + 4 >> 2] & -8) - a | 0;
                                        B = H >>> 0 < A >>> 0;
                                        A = B ? H : A;
                                        z = B ? F : z;
                                        B = c[F + 16 >> 2] | 0;
                                        if ((B | 0) != 0) {
                                            F = B;
                                            continue
                                        }
                                        F = c[F + 20 >> 2] | 0;
                                        if ((F | 0) == 0) {
                                            break
                                        }
                                    }
                                }
                                if ((z | 0) != 0 ? A >>> 0 < ((c[14224 >> 2] | 0) - a | 0) >>> 0 : 0) {
                                    f = c[14232 >> 2] | 0;
                                    if (z >>> 0 < f >>> 0) {
                                        Ca()
                                    }
                                    d = z + a | 0;
                                    if (!(z >>> 0 < d >>> 0)) {
                                        Ca()
                                    }
                                    e = c[z + 24 >> 2] | 0;
                                    h = c[z + 12 >> 2] | 0;
                                    do {
                                        if ((h | 0) == (z | 0)) {
                                            h = z + 20 | 0;
                                            g = c[h >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                h = z + 16 | 0;
                                                g = c[h >> 2] | 0;
                                                if ((g | 0) == 0) {
                                                    x = 0;
                                                    break
                                                }
                                            }
                                            while (1) {
                                                j = g + 20 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) != 0) {
                                                    g = k;
                                                    h = j;
                                                    continue
                                                }
                                                j = g + 16 | 0;
                                                k = c[j >> 2] | 0;
                                                if ((k | 0) == 0) {
                                                    break
                                                } else {
                                                    g = k;
                                                    h = j
                                                }
                                            }
                                            if (h >>> 0 < f >>> 0) {
                                                Ca()
                                            } else {
                                                c[h >> 2] = 0;
                                                x = g;
                                                break
                                            }
                                        } else {
                                            g = c[z + 8 >> 2] | 0;
                                            if (g >>> 0 < f >>> 0) {
                                                Ca()
                                            }
                                            f = g + 12 | 0;
                                            if ((c[f >> 2] | 0) != (z | 0)) {
                                                Ca()
                                            }
                                            j = h + 8 | 0;
                                            if ((c[j >> 2] | 0) == (z | 0)) {
                                                c[f >> 2] = h;
                                                c[j >> 2] = g;
                                                x = h;
                                                break
                                            } else {
                                                Ca()
                                            }
                                        }
                                    } while (0);
                                    do {
                                        if ((e | 0) != 0) {
                                            g = c[z + 28 >> 2] | 0;
                                            f = 14520 + (g << 2) | 0;
                                            if ((z | 0) == (c[f >> 2] | 0)) {
                                                c[f >> 2] = x;
                                                if ((x | 0) == 0) {
                                                    c[14220 >> 2] = c[14220 >> 2] & ~(1 << g);
                                                    break
                                                }
                                            } else {
                                                if (e >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                    Ca()
                                                }
                                                f = e + 16 | 0;
                                                if ((c[f >> 2] | 0) == (z | 0)) {
                                                    c[f >> 2] = x
                                                } else {
                                                    c[e + 20 >> 2] = x
                                                }
                                                if ((x | 0) == 0) {
                                                    break
                                                }
                                            }
                                            if (x >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                Ca()
                                            }
                                            c[x + 24 >> 2] = e;
                                            e = c[z + 16 >> 2] | 0;
                                            do {
                                                if ((e | 0) != 0) {
                                                    if (e >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                        Ca()
                                                    } else {
                                                        c[x + 16 >> 2] = e;
                                                        c[e + 24 >> 2] = x;
                                                        break
                                                    }
                                                }
                                            } while (0);
                                            e = c[z + 20 >> 2] | 0;
                                            if ((e | 0) != 0) {
                                                if (e >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                    Ca()
                                                } else {
                                                    c[x + 20 >> 2] = e;
                                                    c[e + 24 >> 2] = x;
                                                    break
                                                }
                                            }
                                        }
                                    } while (0);
                                    b: do {
                                        if (!(A >>> 0 < 16)) {
                                            c[z + 4 >> 2] = a | 3;
                                            c[z + (a | 4) >> 2] = A | 1;
                                            c[z + (A + a) >> 2] = A;
                                            f = A >>> 3;
                                            if (A >>> 0 < 256) {
                                                h = f << 1;
                                                e = 14256 + (h << 2) | 0;
                                                g = c[3554] | 0;
                                                f = 1 << f;
                                                do {
                                                    if ((g & f | 0) == 0) {
                                                        c[3554] = g | f;
                                                        w = 14256 + (h + 2 << 2) | 0;
                                                        v = e
                                                    } else {
                                                        f = 14256 + (h + 2 << 2) | 0;
                                                        g = c[f >> 2] | 0;
                                                        if (!(g >>> 0 < (c[14232 >> 2] | 0) >>> 0)) {
                                                            w = f;
                                                            v = g;
                                                            break
                                                        }
                                                        Ca()
                                                    }
                                                } while (0);
                                                c[w >> 2] = d;
                                                c[v + 12 >> 2] = d;
                                                c[z + (a + 8) >> 2] = v;
                                                c[z + (a + 12) >> 2] = e;
                                                break
                                            }
                                            e = A >>> 8;
                                            if ((e | 0) != 0) {
                                                if (A >>> 0 > 16777215) {
                                                    e = 31
                                                } else {
                                                    G = (e + 1048320 | 0) >>> 16 & 8;
                                                    H = e << G;
                                                    F = (H + 520192 | 0) >>> 16 & 4;
                                                    H = H << F;
                                                    e = (H + 245760 | 0) >>> 16 & 2;
                                                    e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                    e = A >>> (e + 7 | 0) & 1 | e << 1
                                                }
                                            } else {
                                                e = 0
                                            }
                                            f = 14520 + (e << 2) | 0;
                                            c[z + (a + 28) >> 2] = e;
                                            c[z + (a + 20) >> 2] = 0;
                                            c[z + (a + 16) >> 2] = 0;
                                            h = c[14220 >> 2] | 0;
                                            g = 1 << e;
                                            if ((h & g | 0) == 0) {
                                                c[14220 >> 2] = h | g;
                                                c[f >> 2] = d;
                                                c[z + (a + 24) >> 2] = f;
                                                c[z + (a + 12) >> 2] = d;
                                                c[z + (a + 8) >> 2] = d;
                                                break
                                            }
                                            f = c[f >> 2] | 0;
                                            if ((e | 0) == 31) {
                                                e = 0
                                            } else {
                                                e = 25 - (e >>> 1) | 0
                                            }
                                            c: do {
                                                if ((c[f + 4 >> 2] & -8 | 0) != (A | 0)) {
                                                    e = A << e;
                                                    while (1) {
                                                        g = f + (e >>> 31 << 2) + 16 | 0;
                                                        h = c[g >> 2] | 0;
                                                        if ((h | 0) == 0) {
                                                            break
                                                        }
                                                        if ((c[h + 4 >> 2] & -8 | 0) == (A | 0)) {
                                                            p = h;
                                                            break c
                                                        } else {
                                                            e = e << 1;
                                                            f = h
                                                        }
                                                    }
                                                    if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                        Ca()
                                                    } else {
                                                        c[g >> 2] = d;
                                                        c[z + (a + 24) >> 2] = f;
                                                        c[z + (a + 12) >> 2] = d;
                                                        c[z + (a + 8) >> 2] = d;
                                                        break b
                                                    }
                                                } else {
                                                    p = f
                                                }
                                            } while (0);
                                            f = p + 8 | 0;
                                            e = c[f >> 2] | 0;
                                            g = c[14232 >> 2] | 0;
                                            if (p >>> 0 < g >>> 0) {
                                                Ca()
                                            }
                                            if (e >>> 0 < g >>> 0) {
                                                Ca()
                                            } else {
                                                c[e + 12 >> 2] = d;
                                                c[f >> 2] = d;
                                                c[z + (a + 8) >> 2] = e;
                                                c[z + (a + 12) >> 2] = p;
                                                c[z + (a + 24) >> 2] = 0;
                                                break
                                            }
                                        } else {
                                            H = A + a | 0;
                                            c[z + 4 >> 2] = H | 3;
                                            H = z + (H + 4) | 0;
                                            c[H >> 2] = c[H >> 2] | 1
                                        }
                                    } while (0);
                                    H = z + 8 | 0;
                                    i = b;
                                    return H | 0
                                }
                            }
                        } else {
                            a = -1
                        }
                    }
                } while (0);
                p = c[14224 >> 2] | 0;
                if (!(a >>> 0 > p >>> 0)) {
                    e = p - a | 0;
                    d = c[14236 >> 2] | 0;
                    if (e >>> 0 > 15) {
                        c[14236 >> 2] = d + a;
                        c[14224 >> 2] = e;
                        c[d + (a + 4) >> 2] = e | 1;
                        c[d + p >> 2] = e;
                        c[d + 4 >> 2] = a | 3
                    } else {
                        c[14224 >> 2] = 0;
                        c[14236 >> 2] = 0;
                        c[d + 4 >> 2] = p | 3;
                        H = d + (p + 4) | 0;
                        c[H >> 2] = c[H >> 2] | 1
                    }
                    H = d + 8 | 0;
                    i = b;
                    return H | 0
                }
                p = c[14228 >> 2] | 0;
                if (a >>> 0 < p >>> 0) {
                    G = p - a | 0;
                    c[14228 >> 2] = G;
                    H = c[14240 >> 2] | 0;
                    c[14240 >> 2] = H + a;
                    c[H + (a + 4) >> 2] = G | 1;
                    c[H + 4 >> 2] = a | 3;
                    H = H + 8 | 0;
                    i = b;
                    return H | 0
                }
                do {
                    if ((c[3672] | 0) == 0) {
                        p = ra(30) | 0;
                        if ((p + -1 & p | 0) == 0) {
                            c[14696 >> 2] = p;
                            c[14692 >> 2] = p;
                            c[14700 >> 2] = -1;
                            c[14704 >> 2] = -1;
                            c[14708 >> 2] = 0;
                            c[14660 >> 2] = 0;
                            c[3672] = (Ea(0) | 0) & -16 ^ 1431655768;
                            break
                        } else {
                            Ca()
                        }
                    }
                } while (0);
                w = a + 48 | 0;
                p = c[14696 >> 2] | 0;
                x = a + 47 | 0;
                z = p + x | 0;
                p = 0 - p | 0;
                v = z & p;
                if (!(v >>> 0 > a >>> 0)) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                A = c[14656 >> 2] | 0;
                if ((A | 0) != 0 ? (G = c[14648 >> 2] | 0, H = G + v | 0, H >>> 0 <= G >>> 0 | H >>> 0 > A >>> 0) : 0) {
                    H = 0;
                    i = b;
                    return H | 0
                }
                d: do {
                    if ((c[14660 >> 2] & 4 | 0) == 0) {
                        B = c[14240 >> 2] | 0;
                        e: do {
                            if ((B | 0) != 0) {
                                A = 14664 | 0;
                                while (1) {
                                    C = c[A >> 2] | 0;
                                    if (!(C >>> 0 > B >>> 0) ? (y = A + 4 | 0, (C + (c[y >> 2] | 0) | 0) >>> 0 > B >>> 0) : 0) {
                                        break
                                    }
                                    A = c[A + 8 >> 2] | 0;
                                    if ((A | 0) == 0) {
                                        o = 182;
                                        break e
                                    }
                                }
                                if ((A | 0) != 0) {
                                    B = z - (c[14228 >> 2] | 0) & p;
                                    if (B >>> 0 < 2147483647) {
                                        p = oa(B | 0) | 0;
                                        A = (p | 0) == ((c[A >> 2] | 0) + (c[y >> 2] | 0) | 0);
                                        y = p;
                                        z = B;
                                        p = A ? p : -1;
                                        A = A ? B : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    o = 182
                                }
                            } else {
                                o = 182
                            }
                        } while (0);
                        do {
                            if ((o | 0) == 182) {
                                p = oa(0) | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    z = p;
                                    A = c[14692 >> 2] | 0;
                                    y = A + -1 | 0;
                                    if ((y & z | 0) == 0) {
                                        A = v
                                    } else {
                                        A = v - z + (y + z & 0 - A) | 0
                                    }
                                    y = c[14648 >> 2] | 0;
                                    z = y + A | 0;
                                    if (A >>> 0 > a >>> 0 & A >>> 0 < 2147483647) {
                                        H = c[14656 >> 2] | 0;
                                        if ((H | 0) != 0 ? z >>> 0 <= y >>> 0 | z >>> 0 > H >>> 0 : 0) {
                                            A = 0;
                                            break
                                        }
                                        y = oa(A | 0) | 0;
                                        o = (y | 0) == (p | 0);
                                        z = A;
                                        p = o ? p : -1;
                                        A = o ? A : 0;
                                        o = 191
                                    } else {
                                        A = 0
                                    }
                                } else {
                                    A = 0
                                }
                            }
                        } while (0);
                        f: do {
                            if ((o | 0) == 191) {
                                o = 0 - z | 0;
                                if ((p | 0) != (-1 | 0)) {
                                    q = A;
                                    o = 202;
                                    break d
                                }
                                do {
                                    if ((y | 0) != (-1 | 0) & z >>> 0 < 2147483647 & z >>> 0 < w >>> 0 ? (u = c[14696 >> 2] | 0, u = x - z + u & 0 - u, u >>> 0 < 2147483647) : 0) {
                                        if ((oa(u | 0) | 0) == (-1 | 0)) {
                                            oa(o | 0) | 0;
                                            break f
                                        } else {
                                            z = u + z | 0;
                                            break
                                        }
                                    }
                                } while (0);
                                if ((y | 0) != (-1 | 0)) {
                                    p = y;
                                    q = z;
                                    o = 202;
                                    break d
                                }
                            }
                        } while (0);
                        c[14660 >> 2] = c[14660 >> 2] | 4;
                        o = 199
                    } else {
                        A = 0;
                        o = 199
                    }
                } while (0);
                if ((((o | 0) == 199 ? v >>> 0 < 2147483647 : 0) ? (t = oa(v | 0) | 0, s = oa(0) | 0, (s | 0) != (-1 | 0) & (t | 0) != (-1 | 0) & t >>> 0 < s >>> 0) : 0) ? (r = s - t | 0, q = r >>> 0 > (a + 40 | 0) >>> 0, q) : 0) {
                    p = t;
                    q = q ? r : A;
                    o = 202
                }
                if ((o | 0) == 202) {
                    r = (c[14648 >> 2] | 0) + q | 0;
                    c[14648 >> 2] = r;
                    if (r >>> 0 > (c[14652 >> 2] | 0) >>> 0) {
                        c[14652 >> 2] = r
                    }
                    r = c[14240 >> 2] | 0;
                    g: do {
                        if ((r | 0) != 0) {
                            v = 14664 | 0;
                            while (1) {
                                t = c[v >> 2] | 0;
                                u = v + 4 | 0;
                                s = c[u >> 2] | 0;
                                if ((p | 0) == (t + s | 0)) {
                                    o = 214;
                                    break
                                }
                                w = c[v + 8 >> 2] | 0;
                                if ((w | 0) == 0) {
                                    break
                                } else {
                                    v = w
                                }
                            }
                            if (((o | 0) == 214 ? (c[v + 12 >> 2] & 8 | 0) == 0 : 0) ? r >>> 0 >= t >>> 0 & r >>> 0 < p >>> 0 : 0) {
                                c[u >> 2] = s + q;
                                d = (c[14228 >> 2] | 0) + q | 0;
                                e = r + 8 | 0;
                                if ((e & 7 | 0) == 0) {
                                    e = 0
                                } else {
                                    e = 0 - e & 7
                                }
                                H = d - e | 0;
                                c[14240 >> 2] = r + e;
                                c[14228 >> 2] = H;
                                c[r + (e + 4) >> 2] = H | 1;
                                c[r + (d + 4) >> 2] = 40;
                                c[14244 >> 2] = c[14704 >> 2];
                                break
                            }
                            if (p >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                c[14232 >> 2] = p
                            }
                            t = p + q | 0;
                            s = 14664 | 0;
                            while (1) {
                                if ((c[s >> 2] | 0) == (t | 0)) {
                                    o = 224;
                                    break
                                }
                                u = c[s + 8 >> 2] | 0;
                                if ((u | 0) == 0) {
                                    break
                                } else {
                                    s = u
                                }
                            }
                            if ((o | 0) == 224 ? (c[s + 12 >> 2] & 8 | 0) == 0 : 0) {
                                c[s >> 2] = p;
                                h = s + 4 | 0;
                                c[h >> 2] = (c[h >> 2] | 0) + q;
                                h = p + 8 | 0;
                                if ((h & 7 | 0) == 0) {
                                    h = 0
                                } else {
                                    h = 0 - h & 7
                                }
                                j = p + (q + 8) | 0;
                                if ((j & 7 | 0) == 0) {
                                    n = 0
                                } else {
                                    n = 0 - j & 7
                                }
                                o = p + (n + q) | 0;
                                j = h + a | 0;
                                k = p + j | 0;
                                m = o - (p + h) - a | 0;
                                c[p + (h + 4) >> 2] = a | 3;
                                h: do {
                                    if ((o | 0) != (c[14240 >> 2] | 0)) {
                                        if ((o | 0) == (c[14236 >> 2] | 0)) {
                                            H = (c[14224 >> 2] | 0) + m | 0;
                                            c[14224 >> 2] = H;
                                            c[14236 >> 2] = k;
                                            c[p + (j + 4) >> 2] = H | 1;
                                            c[p + (H + j) >> 2] = H;
                                            break
                                        }
                                        r = q + 4 | 0;
                                        t = c[p + (r + n) >> 2] | 0;
                                        if ((t & 3 | 0) == 1) {
                                            a = t & -8;
                                            s = t >>> 3;
                                            i: do {
                                                if (!(t >>> 0 < 256)) {
                                                    l = c[p + ((n | 24) + q) >> 2] | 0;
                                                    u = c[p + (q + 12 + n) >> 2] | 0;
                                                    do {
                                                        if ((u | 0) == (o | 0)) {
                                                            u = n | 16;
                                                            t = p + (r + u) | 0;
                                                            s = c[t >> 2] | 0;
                                                            if ((s | 0) == 0) {
                                                                t = p + (u + q) | 0;
                                                                s = c[t >> 2] | 0;
                                                                if ((s | 0) == 0) {
                                                                    g = 0;
                                                                    break
                                                                }
                                                            }
                                                            while (1) {
                                                                u = s + 20 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) != 0) {
                                                                    s = v;
                                                                    t = u;
                                                                    continue
                                                                }
                                                                u = s + 16 | 0;
                                                                v = c[u >> 2] | 0;
                                                                if ((v | 0) == 0) {
                                                                    break
                                                                } else {
                                                                    s = v;
                                                                    t = u
                                                                }
                                                            }
                                                            if (t >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            } else {
                                                                c[t >> 2] = 0;
                                                                g = s;
                                                                break
                                                            }
                                                        } else {
                                                            t = c[p + ((n | 8) + q) >> 2] | 0;
                                                            if (t >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            }
                                                            v = t + 12 | 0;
                                                            if ((c[v >> 2] | 0) != (o | 0)) {
                                                                Ca()
                                                            }
                                                            s = u + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[v >> 2] = u;
                                                                c[s >> 2] = t;
                                                                g = u;
                                                                break
                                                            } else {
                                                                Ca()
                                                            }
                                                        }
                                                    } while (0);
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    t = c[p + (q + 28 + n) >> 2] | 0;
                                                    s = 14520 + (t << 2) | 0;
                                                    do {
                                                        if ((o | 0) != (c[s >> 2] | 0)) {
                                                            if (l >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            }
                                                            s = l + 16 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                c[s >> 2] = g
                                                            } else {
                                                                c[l + 20 >> 2] = g
                                                            }
                                                            if ((g | 0) == 0) {
                                                                break i
                                                            }
                                                        } else {
                                                            c[s >> 2] = g;
                                                            if ((g | 0) != 0) {
                                                                break
                                                            }
                                                            c[14220 >> 2] = c[14220 >> 2] & ~(1 << t);
                                                            break i
                                                        }
                                                    } while (0);
                                                    if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                        Ca()
                                                    }
                                                    c[g + 24 >> 2] = l;
                                                    l = n | 16;
                                                    o = c[p + (l + q) >> 2] | 0;
                                                    do {
                                                        if ((o | 0) != 0) {
                                                            if (o >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            } else {
                                                                c[g + 16 >> 2] = o;
                                                                c[o + 24 >> 2] = g;
                                                                break
                                                            }
                                                        }
                                                    } while (0);
                                                    l = c[p + (r + l) >> 2] | 0;
                                                    if ((l | 0) == 0) {
                                                        break
                                                    }
                                                    if (l >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                        Ca()
                                                    } else {
                                                        c[g + 20 >> 2] = l;
                                                        c[l + 24 >> 2] = g;
                                                        break
                                                    }
                                                } else {
                                                    r = c[p + ((n | 8) + q) >> 2] | 0;
                                                    g = c[p + (q + 12 + n) >> 2] | 0;
                                                    t = 14256 + (s << 1 << 2) | 0;
                                                    do {
                                                        if ((r | 0) != (t | 0)) {
                                                            if (r >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            }
                                                            if ((c[r + 12 >> 2] | 0) == (o | 0)) {
                                                                break
                                                            }
                                                            Ca()
                                                        }
                                                    } while (0);
                                                    if ((g | 0) == (r | 0)) {
                                                        c[3554] = c[3554] & ~(1 << s);
                                                        break
                                                    }
                                                    do {
                                                        if ((g | 0) == (t | 0)) {
                                                            l = g + 8 | 0
                                                        } else {
                                                            if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                                Ca()
                                                            }
                                                            s = g + 8 | 0;
                                                            if ((c[s >> 2] | 0) == (o | 0)) {
                                                                l = s;
                                                                break
                                                            }
                                                            Ca()
                                                        }
                                                    } while (0);
                                                    c[r + 12 >> 2] = g;
                                                    c[l >> 2] = r
                                                }
                                            } while (0);
                                            o = p + ((a | n) + q) | 0;
                                            m = a + m | 0
                                        }
                                        g = o + 4 | 0;
                                        c[g >> 2] = c[g >> 2] & -2;
                                        c[p + (j + 4) >> 2] = m | 1;
                                        c[p + (m + j) >> 2] = m;
                                        g = m >>> 3;
                                        if (m >>> 0 < 256) {
                                            m = g << 1;
                                            d = 14256 + (m << 2) | 0;
                                            l = c[3554] | 0;
                                            g = 1 << g;
                                            do {
                                                if ((l & g | 0) == 0) {
                                                    c[3554] = l | g;
                                                    f = 14256 + (m + 2 << 2) | 0;
                                                    e = d
                                                } else {
                                                    l = 14256 + (m + 2 << 2) | 0;
                                                    g = c[l >> 2] | 0;
                                                    if (!(g >>> 0 < (c[14232 >> 2] | 0) >>> 0)) {
                                                        f = l;
                                                        e = g;
                                                        break
                                                    }
                                                    Ca()
                                                }
                                            } while (0);
                                            c[f >> 2] = k;
                                            c[e + 12 >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            break
                                        }
                                        e = m >>> 8;
                                        do {
                                            if ((e | 0) == 0) {
                                                e = 0
                                            } else {
                                                if (m >>> 0 > 16777215) {
                                                    e = 31;
                                                    break
                                                }
                                                G = (e + 1048320 | 0) >>> 16 & 8;
                                                H = e << G;
                                                F = (H + 520192 | 0) >>> 16 & 4;
                                                H = H << F;
                                                e = (H + 245760 | 0) >>> 16 & 2;
                                                e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                                e = m >>> (e + 7 | 0) & 1 | e << 1
                                            }
                                        } while (0);
                                        l = 14520 + (e << 2) | 0;
                                        c[p + (j + 28) >> 2] = e;
                                        c[p + (j + 20) >> 2] = 0;
                                        c[p + (j + 16) >> 2] = 0;
                                        f = c[14220 >> 2] | 0;
                                        g = 1 << e;
                                        if ((f & g | 0) == 0) {
                                            c[14220 >> 2] = f | g;
                                            c[l >> 2] = k;
                                            c[p + (j + 24) >> 2] = l;
                                            c[p + (j + 12) >> 2] = k;
                                            c[p + (j + 8) >> 2] = k;
                                            break
                                        }
                                        l = c[l >> 2] | 0;
                                        if ((e | 0) == 31) {
                                            e = 0
                                        } else {
                                            e = 25 - (e >>> 1) | 0
                                        }
                                        j: do {
                                            if ((c[l + 4 >> 2] & -8 | 0) != (m | 0)) {
                                                e = m << e;
                                                while (1) {
                                                    g = l + (e >>> 31 << 2) + 16 | 0;
                                                    f = c[g >> 2] | 0;
                                                    if ((f | 0) == 0) {
                                                        break
                                                    }
                                                    if ((c[f + 4 >> 2] & -8 | 0) == (m | 0)) {
                                                        d = f;
                                                        break j
                                                    } else {
                                                        e = e << 1;
                                                        l = f
                                                    }
                                                }
                                                if (g >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                                    Ca()
                                                } else {
                                                    c[g >> 2] = k;
                                                    c[p + (j + 24) >> 2] = l;
                                                    c[p + (j + 12) >> 2] = k;
                                                    c[p + (j + 8) >> 2] = k;
                                                    break h
                                                }
                                            } else {
                                                d = l
                                            }
                                        } while (0);
                                        f = d + 8 | 0;
                                        e = c[f >> 2] | 0;
                                        g = c[14232 >> 2] | 0;
                                        if (d >>> 0 < g >>> 0) {
                                            Ca()
                                        }
                                        if (e >>> 0 < g >>> 0) {
                                            Ca()
                                        } else {
                                            c[e + 12 >> 2] = k;
                                            c[f >> 2] = k;
                                            c[p + (j + 8) >> 2] = e;
                                            c[p + (j + 12) >> 2] = d;
                                            c[p + (j + 24) >> 2] = 0;
                                            break
                                        }
                                    } else {
                                        H = (c[14228 >> 2] | 0) + m | 0;
                                        c[14228 >> 2] = H;
                                        c[14240 >> 2] = k;
                                        c[p + (j + 4) >> 2] = H | 1
                                    }
                                } while (0);
                                H = p + (h | 8) | 0;
                                i = b;
                                return H | 0
                            }
                            e = 14664 | 0;
                            while (1) {
                                d = c[e >> 2] | 0;
                                if (!(d >>> 0 > r >>> 0) ? (n = c[e + 4 >> 2] | 0, m = d + n | 0, m >>> 0 > r >>> 0) : 0) {
                                    break
                                }
                                e = c[e + 8 >> 2] | 0
                            }
                            e = d + (n + -39) | 0;
                            if ((e & 7 | 0) == 0) {
                                e = 0
                            } else {
                                e = 0 - e & 7
                            }
                            d = d + (n + -47 + e) | 0;
                            d = d >>> 0 < (r + 16 | 0) >>> 0 ? r : d;
                            e = d + 8 | 0;
                            f = p + 8 | 0;
                            if ((f & 7 | 0) == 0) {
                                f = 0
                            } else {
                                f = 0 - f & 7
                            }
                            H = q + -40 - f | 0;
                            c[14240 >> 2] = p + f;
                            c[14228 >> 2] = H;
                            c[p + (f + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[14244 >> 2] = c[14704 >> 2];
                            c[d + 4 >> 2] = 27;
                            c[e + 0 >> 2] = c[14664 >> 2];
                            c[e + 4 >> 2] = c[14668 >> 2];
                            c[e + 8 >> 2] = c[14672 >> 2];
                            c[e + 12 >> 2] = c[14676 >> 2];
                            c[14664 >> 2] = p;
                            c[14668 >> 2] = q;
                            c[14676 >> 2] = 0;
                            c[14672 >> 2] = e;
                            e = d + 28 | 0;
                            c[e >> 2] = 7;
                            if ((d + 32 | 0) >>> 0 < m >>> 0) {
                                do {
                                    H = e;
                                    e = e + 4 | 0;
                                    c[e >> 2] = 7
                                } while ((H + 8 | 0) >>> 0 < m >>> 0)
                            }
                            if ((d | 0) != (r | 0)) {
                                d = d - r | 0;
                                e = r + (d + 4) | 0;
                                c[e >> 2] = c[e >> 2] & -2;
                                c[r + 4 >> 2] = d | 1;
                                c[r + d >> 2] = d;
                                e = d >>> 3;
                                if (d >>> 0 < 256) {
                                    g = e << 1;
                                    d = 14256 + (g << 2) | 0;
                                    f = c[3554] | 0;
                                    e = 1 << e;
                                    do {
                                        if ((f & e | 0) == 0) {
                                            c[3554] = f | e;
                                            k = 14256 + (g + 2 << 2) | 0;
                                            j = d
                                        } else {
                                            f = 14256 + (g + 2 << 2) | 0;
                                            e = c[f >> 2] | 0;
                                            if (!(e >>> 0 < (c[14232 >> 2] | 0) >>> 0)) {
                                                k = f;
                                                j = e;
                                                break
                                            }
                                            Ca()
                                        }
                                    } while (0);
                                    c[k >> 2] = r;
                                    c[j + 12 >> 2] = r;
                                    c[r + 8 >> 2] = j;
                                    c[r + 12 >> 2] = d;
                                    break
                                }
                                e = d >>> 8;
                                if ((e | 0) != 0) {
                                    if (d >>> 0 > 16777215) {
                                        e = 31
                                    } else {
                                        G = (e + 1048320 | 0) >>> 16 & 8;
                                        H = e << G;
                                        F = (H + 520192 | 0) >>> 16 & 4;
                                        H = H << F;
                                        e = (H + 245760 | 0) >>> 16 & 2;
                                        e = 14 - (F | G | e) + (H << e >>> 15) | 0;
                                        e = d >>> (e + 7 | 0) & 1 | e << 1
                                    }
                                } else {
                                    e = 0
                                }
                                j = 14520 + (e << 2) | 0;
                                c[r + 28 >> 2] = e;
                                c[r + 20 >> 2] = 0;
                                c[r + 16 >> 2] = 0;
                                f = c[14220 >> 2] | 0;
                                g = 1 << e;
                                if ((f & g | 0) == 0) {
                                    c[14220 >> 2] = f | g;
                                    c[j >> 2] = r;
                                    c[r + 24 >> 2] = j;
                                    c[r + 12 >> 2] = r;
                                    c[r + 8 >> 2] = r;
                                    break
                                }
                                f = c[j >> 2] | 0;
                                if ((e | 0) == 31) {
                                    e = 0
                                } else {
                                    e = 25 - (e >>> 1) | 0
                                }
                                k: do {
                                    if ((c[f + 4 >> 2] & -8 | 0) != (d | 0)) {
                                        e = d << e;
                                        while (1) {
                                            j = f + (e >>> 31 << 2) + 16 | 0;
                                            g = c[j >> 2] | 0;
                                            if ((g | 0) == 0) {
                                                break
                                            }
                                            if ((c[g + 4 >> 2] & -8 | 0) == (d | 0)) {
                                                h = g;
                                                break k
                                            } else {
                                                e = e << 1;
                                                f = g
                                            }
                                        }
                                        if (j >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                            Ca()
                                        } else {
                                            c[j >> 2] = r;
                                            c[r + 24 >> 2] = f;
                                            c[r + 12 >> 2] = r;
                                            c[r + 8 >> 2] = r;
                                            break g
                                        }
                                    } else {
                                        h = f
                                    }
                                } while (0);
                                f = h + 8 | 0;
                                e = c[f >> 2] | 0;
                                d = c[14232 >> 2] | 0;
                                if (h >>> 0 < d >>> 0) {
                                    Ca()
                                }
                                if (e >>> 0 < d >>> 0) {
                                    Ca()
                                } else {
                                    c[e + 12 >> 2] = r;
                                    c[f >> 2] = r;
                                    c[r + 8 >> 2] = e;
                                    c[r + 12 >> 2] = h;
                                    c[r + 24 >> 2] = 0;
                                    break
                                }
                            }
                        } else {
                            H = c[14232 >> 2] | 0;
                            if ((H | 0) == 0 | p >>> 0 < H >>> 0) {
                                c[14232 >> 2] = p
                            }
                            c[14664 >> 2] = p;
                            c[14668 >> 2] = q;
                            c[14676 >> 2] = 0;
                            c[14252 >> 2] = c[3672];
                            c[14248 >> 2] = -1;
                            d = 0;
                            do {
                                H = d << 1;
                                G = 14256 + (H << 2) | 0;
                                c[14256 + (H + 3 << 2) >> 2] = G;
                                c[14256 + (H + 2 << 2) >> 2] = G;
                                d = d + 1 | 0
                            } while ((d | 0) != 32);
                            d = p + 8 | 0;
                            if ((d & 7 | 0) == 0) {
                                d = 0
                            } else {
                                d = 0 - d & 7
                            }
                            H = q + -40 - d | 0;
                            c[14240 >> 2] = p + d;
                            c[14228 >> 2] = H;
                            c[p + (d + 4) >> 2] = H | 1;
                            c[p + (q + -36) >> 2] = 40;
                            c[14244 >> 2] = c[14704 >> 2]
                        }
                    } while (0);
                    d = c[14228 >> 2] | 0;
                    if (d >>> 0 > a >>> 0) {
                        G = d - a | 0;
                        c[14228 >> 2] = G;
                        H = c[14240 >> 2] | 0;
                        c[14240 >> 2] = H + a;
                        c[H + (a + 4) >> 2] = G | 1;
                        c[H + 4 >> 2] = a | 3;
                        H = H + 8 | 0;
                        i = b;
                        return H | 0
                    }
                }
                c[(za() | 0) >> 2] = 12;
                H = 0;
                i = b;
                return H | 0
            }
            function tb(a) {
                a = a | 0;
                var b = 0, d = 0, e = 0, f = 0, g = 0, h = 0, j = 0, k = 0, l = 0, m = 0, n = 0, o = 0, p = 0, q = 0, r = 0, s = 0, t = 0, u = 0, v = 0, w = 0;
                b = i;
                if ((a | 0) == 0) {
                    i = b;
                    return
                }
                q = a + -8 | 0;
                r = c[14232 >> 2] | 0;
                if (q >>> 0 < r >>> 0) {
                    Ca()
                }
                o = c[a + -4 >> 2] | 0;
                n = o & 3;
                if ((n | 0) == 1) {
                    Ca()
                }
                j = o & -8;
                h = a + (j + -8) | 0;
                do {
                    if ((o & 1 | 0) == 0) {
                        u = c[q >> 2] | 0;
                        if ((n | 0) == 0) {
                            i = b;
                            return
                        }
                        q = -8 - u | 0;
                        o = a + q | 0;
                        n = u + j | 0;
                        if (o >>> 0 < r >>> 0) {
                            Ca()
                        }
                        if ((o | 0) == (c[14236 >> 2] | 0)) {
                            d = a + (j + -4) | 0;
                            if ((c[d >> 2] & 3 | 0) != 3) {
                                d = o;
                                m = n;
                                break
                            }
                            c[14224 >> 2] = n;
                            c[d >> 2] = c[d >> 2] & -2;
                            c[a + (q + 4) >> 2] = n | 1;
                            c[h >> 2] = n;
                            i = b;
                            return
                        }
                        t = u >>> 3;
                        if (u >>> 0 < 256) {
                            d = c[a + (q + 8) >> 2] | 0;
                            m = c[a + (q + 12) >> 2] | 0;
                            p = 14256 + (t << 1 << 2) | 0;
                            if ((d | 0) != (p | 0)) {
                                if (d >>> 0 < r >>> 0) {
                                    Ca()
                                }
                                if ((c[d + 12 >> 2] | 0) != (o | 0)) {
                                    Ca()
                                }
                            }
                            if ((m | 0) == (d | 0)) {
                                c[3554] = c[3554] & ~(1 << t);
                                d = o;
                                m = n;
                                break
                            }
                            if ((m | 0) != (p | 0)) {
                                if (m >>> 0 < r >>> 0) {
                                    Ca()
                                }
                                p = m + 8 | 0;
                                if ((c[p >> 2] | 0) == (o | 0)) {
                                    s = p
                                } else {
                                    Ca()
                                }
                            } else {
                                s = m + 8 | 0
                            }
                            c[d + 12 >> 2] = m;
                            c[s >> 2] = d;
                            d = o;
                            m = n;
                            break
                        }
                        s = c[a + (q + 24) >> 2] | 0;
                        t = c[a + (q + 12) >> 2] | 0;
                        do {
                            if ((t | 0) == (o | 0)) {
                                u = a + (q + 20) | 0;
                                t = c[u >> 2] | 0;
                                if ((t | 0) == 0) {
                                    u = a + (q + 16) | 0;
                                    t = c[u >> 2] | 0;
                                    if ((t | 0) == 0) {
                                        p = 0;
                                        break
                                    }
                                }
                                while (1) {
                                    w = t + 20 | 0;
                                    v = c[w >> 2] | 0;
                                    if ((v | 0) != 0) {
                                        t = v;
                                        u = w;
                                        continue
                                    }
                                    v = t + 16 | 0;
                                    w = c[v >> 2] | 0;
                                    if ((w | 0) == 0) {
                                        break
                                    } else {
                                        t = w;
                                        u = v
                                    }
                                }
                                if (u >>> 0 < r >>> 0) {
                                    Ca()
                                } else {
                                    c[u >> 2] = 0;
                                    p = t;
                                    break
                                }
                            } else {
                                u = c[a + (q + 8) >> 2] | 0;
                                if (u >>> 0 < r >>> 0) {
                                    Ca()
                                }
                                r = u + 12 | 0;
                                if ((c[r >> 2] | 0) != (o | 0)) {
                                    Ca()
                                }
                                v = t + 8 | 0;
                                if ((c[v >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = t;
                                    c[v >> 2] = u;
                                    p = t;
                                    break
                                } else {
                                    Ca()
                                }
                            }
                        } while (0);
                        if ((s | 0) != 0) {
                            t = c[a + (q + 28) >> 2] | 0;
                            r = 14520 + (t << 2) | 0;
                            if ((o | 0) == (c[r >> 2] | 0)) {
                                c[r >> 2] = p;
                                if ((p | 0) == 0) {
                                    c[14220 >> 2] = c[14220 >> 2] & ~(1 << t);
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                if (s >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                }
                                r = s + 16 | 0;
                                if ((c[r >> 2] | 0) == (o | 0)) {
                                    c[r >> 2] = p
                                } else {
                                    c[s + 20 >> 2] = p
                                }
                                if ((p | 0) == 0) {
                                    d = o;
                                    m = n;
                                    break
                                }
                            }
                            if (p >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                Ca()
                            }
                            c[p + 24 >> 2] = s;
                            r = c[a + (q + 16) >> 2] | 0;
                            do {
                                if ((r | 0) != 0) {
                                    if (r >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    } else {
                                        c[p + 16 >> 2] = r;
                                        c[r + 24 >> 2] = p;
                                        break
                                    }
                                }
                            } while (0);
                            q = c[a + (q + 20) >> 2] | 0;
                            if ((q | 0) != 0) {
                                if (q >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                } else {
                                    c[p + 20 >> 2] = q;
                                    c[q + 24 >> 2] = p;
                                    d = o;
                                    m = n;
                                    break
                                }
                            } else {
                                d = o;
                                m = n
                            }
                        } else {
                            d = o;
                            m = n
                        }
                    } else {
                        d = q;
                        m = j
                    }
                } while (0);
                if (!(d >>> 0 < h >>> 0)) {
                    Ca()
                }
                n = a + (j + -4) | 0;
                o = c[n >> 2] | 0;
                if ((o & 1 | 0) == 0) {
                    Ca()
                }
                if ((o & 2 | 0) == 0) {
                    if ((h | 0) == (c[14240 >> 2] | 0)) {
                        w = (c[14228 >> 2] | 0) + m | 0;
                        c[14228 >> 2] = w;
                        c[14240 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        if ((d | 0) != (c[14236 >> 2] | 0)) {
                            i = b;
                            return
                        }
                        c[14236 >> 2] = 0;
                        c[14224 >> 2] = 0;
                        i = b;
                        return
                    }
                    if ((h | 0) == (c[14236 >> 2] | 0)) {
                        w = (c[14224 >> 2] | 0) + m | 0;
                        c[14224 >> 2] = w;
                        c[14236 >> 2] = d;
                        c[d + 4 >> 2] = w | 1;
                        c[d + w >> 2] = w;
                        i = b;
                        return
                    }
                    m = (o & -8) + m | 0;
                    n = o >>> 3;
                    do {
                        if (!(o >>> 0 < 256)) {
                            l = c[a + (j + 16) >> 2] | 0;
                            q = c[a + (j | 4) >> 2] | 0;
                            do {
                                if ((q | 0) == (h | 0)) {
                                    o = a + (j + 12) | 0;
                                    n = c[o >> 2] | 0;
                                    if ((n | 0) == 0) {
                                        o = a + (j + 8) | 0;
                                        n = c[o >> 2] | 0;
                                        if ((n | 0) == 0) {
                                            k = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        p = n + 20 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) != 0) {
                                            n = q;
                                            o = p;
                                            continue
                                        }
                                        p = n + 16 | 0;
                                        q = c[p >> 2] | 0;
                                        if ((q | 0) == 0) {
                                            break
                                        } else {
                                            n = q;
                                            o = p
                                        }
                                    }
                                    if (o >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    } else {
                                        c[o >> 2] = 0;
                                        k = n;
                                        break
                                    }
                                } else {
                                    o = c[a + j >> 2] | 0;
                                    if (o >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    }
                                    p = o + 12 | 0;
                                    if ((c[p >> 2] | 0) != (h | 0)) {
                                        Ca()
                                    }
                                    n = q + 8 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[p >> 2] = q;
                                        c[n >> 2] = o;
                                        k = q;
                                        break
                                    } else {
                                        Ca()
                                    }
                                }
                            } while (0);
                            if ((l | 0) != 0) {
                                n = c[a + (j + 20) >> 2] | 0;
                                o = 14520 + (n << 2) | 0;
                                if ((h | 0) == (c[o >> 2] | 0)) {
                                    c[o >> 2] = k;
                                    if ((k | 0) == 0) {
                                        c[14220 >> 2] = c[14220 >> 2] & ~(1 << n);
                                        break
                                    }
                                } else {
                                    if (l >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    }
                                    n = l + 16 | 0;
                                    if ((c[n >> 2] | 0) == (h | 0)) {
                                        c[n >> 2] = k
                                    } else {
                                        c[l + 20 >> 2] = k
                                    }
                                    if ((k | 0) == 0) {
                                        break
                                    }
                                }
                                if (k >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                }
                                c[k + 24 >> 2] = l;
                                h = c[a + (j + 8) >> 2] | 0;
                                do {
                                    if ((h | 0) != 0) {
                                        if (h >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                            Ca()
                                        } else {
                                            c[k + 16 >> 2] = h;
                                            c[h + 24 >> 2] = k;
                                            break
                                        }
                                    }
                                } while (0);
                                h = c[a + (j + 12) >> 2] | 0;
                                if ((h | 0) != 0) {
                                    if (h >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                        Ca()
                                    } else {
                                        c[k + 20 >> 2] = h;
                                        c[h + 24 >> 2] = k;
                                        break
                                    }
                                }
                            }
                        } else {
                            k = c[a + j >> 2] | 0;
                            a = c[a + (j | 4) >> 2] | 0;
                            j = 14256 + (n << 1 << 2) | 0;
                            if ((k | 0) != (j | 0)) {
                                if (k >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                }
                                if ((c[k + 12 >> 2] | 0) != (h | 0)) {
                                    Ca()
                                }
                            }
                            if ((a | 0) == (k | 0)) {
                                c[3554] = c[3554] & ~(1 << n);
                                break
                            }
                            if ((a | 0) != (j | 0)) {
                                if (a >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                }
                                j = a + 8 | 0;
                                if ((c[j >> 2] | 0) == (h | 0)) {
                                    l = j
                                } else {
                                    Ca()
                                }
                            } else {
                                l = a + 8 | 0
                            }
                            c[k + 12 >> 2] = a;
                            c[l >> 2] = k
                        }
                    } while (0);
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m;
                    if ((d | 0) == (c[14236 >> 2] | 0)) {
                        c[14224 >> 2] = m;
                        i = b;
                        return
                    }
                } else {
                    c[n >> 2] = o & -2;
                    c[d + 4 >> 2] = m | 1;
                    c[d + m >> 2] = m
                }
                h = m >>> 3;
                if (m >>> 0 < 256) {
                    a = h << 1;
                    e = 14256 + (a << 2) | 0;
                    j = c[3554] | 0;
                    h = 1 << h;
                    if ((j & h | 0) != 0) {
                        h = 14256 + (a + 2 << 2) | 0;
                        a = c[h >> 2] | 0;
                        if (a >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                            Ca()
                        } else {
                            f = h;
                            g = a
                        }
                    } else {
                        c[3554] = j | h;
                        f = 14256 + (a + 2 << 2) | 0;
                        g = e
                    }
                    c[f >> 2] = d;
                    c[g + 12 >> 2] = d;
                    c[d + 8 >> 2] = g;
                    c[d + 12 >> 2] = e;
                    i = b;
                    return
                }
                f = m >>> 8;
                if ((f | 0) != 0) {
                    if (m >>> 0 > 16777215) {
                        f = 31
                    } else {
                        v = (f + 1048320 | 0) >>> 16 & 8;
                        w = f << v;
                        u = (w + 520192 | 0) >>> 16 & 4;
                        w = w << u;
                        f = (w + 245760 | 0) >>> 16 & 2;
                        f = 14 - (u | v | f) + (w << f >>> 15) | 0;
                        f = m >>> (f + 7 | 0) & 1 | f << 1
                    }
                } else {
                    f = 0
                }
                g = 14520 + (f << 2) | 0;
                c[d + 28 >> 2] = f;
                c[d + 20 >> 2] = 0;
                c[d + 16 >> 2] = 0;
                a = c[14220 >> 2] | 0;
                h = 1 << f;
                a: do {
                    if ((a & h | 0) != 0) {
                        g = c[g >> 2] | 0;
                        if ((f | 0) == 31) {
                            f = 0
                        } else {
                            f = 25 - (f >>> 1) | 0
                        }
                        b: do {
                            if ((c[g + 4 >> 2] & -8 | 0) != (m | 0)) {
                                f = m << f;
                                a = g;
                                while (1) {
                                    h = a + (f >>> 31 << 2) + 16 | 0;
                                    g = c[h >> 2] | 0;
                                    if ((g | 0) == 0) {
                                        break
                                    }
                                    if ((c[g + 4 >> 2] & -8 | 0) == (m | 0)) {
                                        e = g;
                                        break b
                                    } else {
                                        f = f << 1;
                                        a = g
                                    }
                                }
                                if (h >>> 0 < (c[14232 >> 2] | 0) >>> 0) {
                                    Ca()
                                } else {
                                    c[h >> 2] = d;
                                    c[d + 24 >> 2] = a;
                                    c[d + 12 >> 2] = d;
                                    c[d + 8 >> 2] = d;
                                    break a
                                }
                            } else {
                                e = g
                            }
                        } while (0);
                        g = e + 8 | 0;
                        f = c[g >> 2] | 0;
                        h = c[14232 >> 2] | 0;
                        if (e >>> 0 < h >>> 0) {
                            Ca()
                        }
                        if (f >>> 0 < h >>> 0) {
                            Ca()
                        } else {
                            c[f + 12 >> 2] = d;
                            c[g >> 2] = d;
                            c[d + 8 >> 2] = f;
                            c[d + 12 >> 2] = e;
                            c[d + 24 >> 2] = 0;
                            break
                        }
                    } else {
                        c[14220 >> 2] = a | h;
                        c[g >> 2] = d;
                        c[d + 24 >> 2] = g;
                        c[d + 12 >> 2] = d;
                        c[d + 8 >> 2] = d
                    }
                } while (0);
                w = (c[14248 >> 2] | 0) + -1 | 0;
                c[14248 >> 2] = w;
                if ((w | 0) == 0) {
                    d = 14672 | 0
                } else {
                    i = b;
                    return
                }
                while (1) {
                    d = c[d >> 2] | 0;
                    if ((d | 0) == 0) {
                        break
                    } else {
                        d = d + 8 | 0
                    }
                }
                c[14248 >> 2] = -1;
                i = b;
                return
            }
            function ub() {
            }
            function vb(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0, g = 0, h = 0, i = 0;
                f = b + e | 0;
                if ((e | 0) >= 20) {
                    d = d & 255;
                    i = b & 3;
                    h = d | d << 8 | d << 16 | d << 24;
                    g = f & ~3;
                    if (i) {
                        i = b + 4 - i | 0;
                        while ((b | 0) < (i | 0)) {
                            a[b >> 0] = d;
                            b = b + 1 | 0
                        }
                    }
                    while ((b | 0) < (g | 0)) {
                        c[b >> 2] = h;
                        b = b + 4 | 0
                    }
                }
                while ((b | 0) < (f | 0)) {
                    a[b >> 0] = d;
                    b = b + 1 | 0
                }
                return b - e | 0
            }
            function wb(b) {
                b = b | 0;
                var c = 0;
                c = b;
                while (a[c >> 0] | 0) {
                    c = c + 1 | 0
                }
                return c - b | 0
            }
            function xb(b, d, e) {
                b = b | 0;
                d = d | 0;
                e = e | 0;
                var f = 0;
                if ((e | 0) >= 4096)
                    return pa(b | 0, d | 0, e | 0) | 0;
                f = b | 0;
                if ((b & 3) == (d & 3)) {
                    while (b & 3) {
                        if ((e | 0) == 0)
                            return f | 0;
                        a[b >> 0] = a[d >> 0] | 0;
                        b = b + 1 | 0;
                        d = d + 1 | 0;
                        e = e - 1 | 0
                    }
                    while ((e | 0) >= 4) {
                        c[b >> 2] = c[d >> 2];
                        b = b + 4 | 0;
                        d = d + 4 | 0;
                        e = e - 4 | 0
                    }
                }
                while ((e | 0) > 0) {
                    a[b >> 0] = a[d >> 0] | 0;
                    b = b + 1 | 0;
                    d = d + 1 | 0;
                    e = e - 1 | 0
                }
                return f | 0
            }
            function yb(a) {
                a = a | 0;
                return (a & 255) << 24 | (a >> 8 & 255) << 16 | (a >> 16 & 255) << 8 | a >>> 24 | 0
            }
            function zb(a, b, c, d) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                d = d | 0;
                return Ha[a & 1](b | 0, c | 0, d | 0) | 0
            }
            function Ab(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                Ia[a & 1](b | 0, c | 0)
            }
            function Bb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                return Ja[a & 3](b | 0, c | 0) | 0
            }
            function Cb(a, b, c) {
                a = a | 0;
                b = b | 0;
                c = c | 0;
                _(0);
                return 0
            }
            function Db(a, b) {
                a = a | 0;
                b = b | 0;
                _(1)
            }
            function Eb(a, b) {
                a = a | 0;
                b = b | 0;
                _(2);
                return 0
            }




            // EMSCRIPTEN_END_FUNCS
            var Ha = [Cb, ob];
            var Ia = [Db, pb];
            var Ja = [Eb, Za, _a, $a];
            return {_strlen: wb,_free: tb,_deflate_file: Sa,_memset: vb,_malloc: sb,_memcpy: xb,_inflate_file: Ta,_llvm_bswap_i32: yb,runPostSets: ub,stackAlloc: Ka,stackSave: La,stackRestore: Ma,setThrew: Na,setTempRet0: Qa,getTempRet0: Ra,dynCall_iiii: zb,dynCall_vii: Ab,dynCall_iii: Bb}
        // EMSCRIPTEN_END_ASM
        
        })({Math: Math,Int8Array: Int8Array,Int16Array: Int16Array,Int32Array: Int32Array,Uint8Array: Uint8Array,Uint16Array: Uint16Array,Uint32Array: Uint32Array,Float32Array: Float32Array,Float64Array: Float64Array}, {abort: B,assert: x,asmPrintInt: function(a, b) {
                p.print("int " + a + "," + b)
            },asmPrintFloat: function(a, b) {
                p.print("float " + a + "," + b)
            },min: ta,invoke_iiii: function(a, b, c, d) {
                try {
                    return p.dynCall_iiii(a, b, c, d)
                } catch (e) {
                    "number" !== typeof e && "longjmp" !== e && f(e), $.setThrew(1, 0)
                }
            },invoke_vii: function(a, 
            b, c) {
                try {
                    p.dynCall_vii(a, b, c)
                } catch (d) {
                    "number" !== typeof d && "longjmp" !== d && f(d), $.setThrew(1, 0)
                }
            },invoke_iii: function(a, b, c) {
                try {
                    return p.dynCall_iii(a, b, c)
                } catch (d) {
                    "number" !== typeof d && "longjmp" !== d && f(d), $.setThrew(1, 0)
                }
            },_send: function(a, b, c) {
                return !Z.ob(a) ? (P(Q.D), -1) : fc(a, b, c)
            },_fread: function(a, b, c, d) {
                c *= b;
                if (0 == c)
                    return 0;
                var e = 0, d = U[d - 1];
                if (!d)
                    return P(Q.D), 0;
                for (; d.Va.length && 0 < c; )
                    I[a++ >> 0] = d.Va.pop(), c--, e++;
                a = Yb(d.A, a, c);
                if (-1 == a)
                    return d && (d.error = j), 0;
                e += a;
                e < c && (d.Yb = j);
                return Math.floor(e / 
                b)
            },___setErrNo: P,___assert_fail: function(a, b, c, d) {
                ia = j;
                f("Assertion failed: " + A(a) + ", at: " + [b ? A(b) : "unknown filename", c, d ? A(d) : "unknown function"] + " at " + Ca())
            },_write: fc,_fflush: m(),_pwrite: function(a, b, c, d) {
                a = U[a];
                if (!a)
                    return P(Q.D), -1;
                try {
                    return Qb(a, I, b, c, d)
                } catch (e) {
                    return ub(e), -1
                }
            },_open: cc,_sbrk: ec,_emscripten_memcpy_big: function(a, b, c) {
                L.set(L.subarray(b, b + c), a);
                return a
            },_fileno: ac,_sysconf: function(a) {
                switch (a) {
                    case 30:
                        return 4096;
                    case 132:
                    case 133:
                    case 12:
                    case 137:
                    case 138:
                    case 15:
                    case 235:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 149:
                    case 13:
                    case 10:
                    case 236:
                    case 153:
                    case 9:
                    case 21:
                    case 22:
                    case 159:
                    case 154:
                    case 14:
                    case 77:
                    case 78:
                    case 139:
                    case 80:
                    case 81:
                    case 79:
                    case 82:
                    case 68:
                    case 67:
                    case 164:
                    case 11:
                    case 29:
                    case 47:
                    case 48:
                    case 95:
                    case 52:
                    case 51:
                    case 46:
                        return 200809;
                    case 27:
                    case 246:
                    case 127:
                    case 128:
                    case 23:
                    case 24:
                    case 160:
                    case 161:
                    case 181:
                    case 182:
                    case 242:
                    case 183:
                    case 184:
                    case 243:
                    case 244:
                    case 245:
                    case 165:
                    case 178:
                    case 179:
                    case 49:
                    case 50:
                    case 168:
                    case 169:
                    case 175:
                    case 170:
                    case 171:
                    case 172:
                    case 97:
                    case 76:
                    case 32:
                    case 173:
                    case 35:
                        return -1;
                    case 176:
                    case 177:
                    case 7:
                    case 155:
                    case 8:
                    case 157:
                    case 125:
                    case 126:
                    case 92:
                    case 93:
                    case 129:
                    case 130:
                    case 131:
                    case 94:
                    case 91:
                        return 1;
                    case 74:
                    case 60:
                    case 69:
                    case 70:
                    case 4:
                        return 1024;
                    case 31:
                    case 42:
                    case 72:
                        return 32;
                    case 87:
                    case 26:
                    case 33:
                        return 2147483647;
                    case 34:
                    case 1:
                        return 47839;
                    case 38:
                    case 36:
                        return 99;
                    case 43:
                    case 37:
                        return 2048;
                    case 0:
                        return 2097152;
                    case 3:
                        return 65536;
                    case 28:
                        return 32768;
                    case 44:
                        return 32767;
                    case 75:
                        return 16384;
                    case 39:
                        return 1E3;
                    case 89:
                        return 700;
                    case 71:
                        return 256;
                    case 40:
                        return 255;
                    case 2:
                        return 100;
                    case 180:
                        return 64;
                    case 25:
                        return 20;
                    case 5:
                        return 16;
                    case 6:
                        return 6;
                    case 73:
                        return 4;
                    case 84:
                        return "object" === typeof navigator ? navigator.hardwareConcurrency || 1 : 1
                }
                P(Q.u);
                return -1
            },
            _close: Zb,_ferror: function(a) {
                a = U[a - 1];
                return Number(a && a.error)
            },_pread: function(a, b, c, d) {
                a = U[a];
                if (!a)
                    return P(Q.D), -1;
                try {
                    return Pb(a, b, c, d)
                } catch (e) {
                    return ub(e), -1
                }
            },_mkport: Xb,_fclose: function(a) {
                a = ac(a);
                $b(a);
                return Zb(a)
            },_feof: function(a) {
                a = U[a - 1];
                return Number(a && a.Yb)
            },_fsync: $b,___errno_location: function() {
                return $a
            },_recv: function(a, b, c) {
                return !Z.ob(a) ? (P(Q.D), -1) : Yb(a, b, c)
            },_read: Yb,_abort: function() {
                p.abort()
            },_fwrite: function(a, b, c, d) {
                c *= b;
                if (0 == c)
                    return 0;
                a = fc(ac(d), a, c);
                if (-1 == a) {
                    if (b = 
                    U[d - 1])
                        b.error = j;
                    return 0
                }
                return Math.floor(a / b)
            },_time: function(a) {
                var b = Math.floor(Date.now() / 1E3);
                a && (J[a >> 2] = b);
                return b
            },_fopen: function(a, b) {
                var c, b = A(b);
                if ("r" == b[0])
                    c = -1 != b.indexOf("+") ? 2 : 0;
                else if ("w" == b[0])
                    c = -1 != b.indexOf("+") ? 2 : 1, c |= 576;
                else if ("a" == b[0])
                    c = -1 != b.indexOf("+") ? 2 : 1, c |= 64, c |= 1024;
                else
                    return P(Q.u), 0;
                c = cc(a, c, K([511, 0, 0, 0], "i32", 1));
                return -1 === c ? 0 : U[c] ? U[c].A + 1 : 0
            },STACKTOP: u,STACK_MAX: Ha,tempDoublePtr: Ya,ABORT: ia,NaN: NaN,Infinity: Infinity}, N), bc = p._strlen = $._strlen;
        p._free = $._free;
        var Ac = p._deflate_file = $._deflate_file, Za = p._memset = $._memset, Aa = p._malloc = $._malloc, dc = p._memcpy = $._memcpy, Bc = p._inflate_file = $._inflate_file, gc = p._llvm_bswap_i32 = $._llvm_bswap_i32;
        p.runPostSets = $.runPostSets;
        p.dynCall_iiii = $.dynCall_iiii;
        p.dynCall_vii = $.dynCall_vii;
        p.dynCall_iii = $.dynCall_iii;
        w.Aa = $.stackAlloc;
        w.Ua = $.stackSave;
        w.Ab = $.stackRestore;
        w.vc = $.setTempRet0;
        w.cc = $.getTempRet0;
        function Cc(a) {
            this.name = "ExitStatus";
            this.message = "Program terminated with exit(" + a + ")";
            this.status = a
        }
        Cc.prototype = Error();
        var Dc, Ec = k, Va = function Fc() {
            !p.calledRun && Gc && Hc();
            p.calledRun || (Va = Fc)
        };
        p.callMain = p.Ae = function(a) {
            function b() {
                for (var a = 0; 3 > a; a++)
                    d.push(0)
            }
            x(0 == O, "cannot call main when async dependencies remain! (listen on __ATMAIN__)");
            x(0 == La.length, "cannot call main when preRun functions remain to be called");
            a = a || [];
            Qa || (Qa = j, Ka(Ma));
            var c = a.length + 1, d = [K(Ta(p.thisProgram || "/bin/this.program"), "i8", 0)];
            b();
            for (var e = 0; e < c - 1; e += 1)
                d.push(K(Ta(a[e]), "i8", 0)), b();
            d.push(0);
            d = K(d, "i32", 0);
            Dc = u;
            try {
                var g = p._main(c, d, 0);
                p.noExitRuntime || Ic(g)
            } catch (h) {
                h instanceof Cc || ("SimulateInfiniteLoop" == 
                h ? p.noExitRuntime = j : (h && ("object" === typeof h && h.stack) && p.U("exception thrown: " + [h, h.stack]), f(h)))
            }finally {
            }
        };
        function Hc(a) {
            function b() {
                if (!p.calledRun) {
                    p.calledRun = j;
                    Qa || (Qa = j, Ka(Ma));
                    Ka(Na);
                    ba && Ec !== k && p.U("pre-main prep time: " + (Date.now() - Ec) + " ms");
                    p._main && Gc && p.callMain(a);
                    if (p.postRun)
                        for ("function" == typeof p.postRun && (p.postRun = [p.postRun]); p.postRun.length; )
                            Sa(p.postRun.shift());
                    Ka(Pa)
                }
            }
            a = a || p.arguments;
            Ec === k && (Ec = Date.now());
            if (0 < O)
                p.U("run() called, but dependencies remain, so not running");
            else {
                if (p.preRun)
                    for ("function" == typeof p.preRun && (p.preRun = [p.preRun]); p.preRun.length; )
                        Ra(p.preRun.shift());
                Ka(La);
                !(0 < O) && !p.calledRun && (p.setStatus ? (p.setStatus("Running..."), setTimeout(function() {
                    setTimeout(function() {
                        p.setStatus("")
                    }, 1);
                    ia || b()
                }, 1)) : b())
            }
        }
        p.run = p.af = Hc;
        function Ic(a) {
            ia = j;
            u = Dc;
            Ka(Oa);
            Qa = l;
            f(new Cc(a))
        }
        p.exit = p.Ee = Ic;
        function B(a) {
            a && (p.print(a), p.U(a));
            ia = j;
            f("abort() at " + Ca() + "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.")
        }
        p.abort = p.abort = B;
        if (p.preInit)
            for ("function" == typeof p.preInit && (p.preInit = [p.preInit]); 0 < p.preInit.length; )
                p.preInit.pop()();
        var Gc = j;
        p.noInitialRun && (Gc = l);
        Hc();
        var Jc = {C: function(a, b) {
                b.mode !== i && (a.mode = b.mode);
                b.timestamp !== i && (a.timestamp = b.timestamp);
                if (b.size !== i) {
                    var c = a.e;
                    if (c.length > b.size)
                        c = c.subarray(0, b.size);
                    else {
                        var d = b.size;
                        if (!(c.length >= d)) {
                            for (var e = c.length; e < d; )
                                e *= 2;
                            d = new Uint8Array(e);
                            d.set(c);
                            c = d
                        }
                    }
                    a.e = c;
                    a.size = b.size
                }
            },fa: T.o.fa,ga: function(a, b, c, d) {
                c = jb(a, b, c, d);
                c.o = Jc;
                c.k = Kc;
                c.e = [];
                c.timestamp = Date.now();
                a && (a.e[b] = c);
                return c
            }}, Kc = {F: function(a, b, c, d, e) {
                a = a.g.e;
                d = Math.min(a.length - e, d);
                if (8 < d && a.subarray)
                    b.set(a.subarray(e, e + d), c);
                else
                    for (var g = 0; g < d; g++)
                        b[c + g] = a[e + g];
                return d
            },write: function(a, b, c, d) {
                a = new Uint8Array(b.buffer, c, d);
                Lc || (a = new Uint8Array(a));
                Mc(a);
                return d
            }};
        function Nc(a, b) {
            var c = Ub("/", a, j, j);
            c.e = b;
            c.o = Jc;
            c.k = Kc
        }
        var Mc = k, Lc;
        function Oc(a) {
            f(Error("zlib-asm: " + a))
        }
        function Pc(a) {
            switch (a) {
                case -2:
                    Oc("invalid compression level");
                case -3:
                    Oc("invalid or incomplete deflate data");
                case -4:
                    Oc("out of memory");
                case -6:
                    Oc("zlib version mismatch")
            }
        }
        function Qc(a, b, c) {
            try {
                var d = X("/input").g;
                xb(d)
            } catch (e) {
            }
            try {
                var g = X("/output").g;
                xb(g)
            } catch (h) {
            }
            Nc("input", a);
            Nc("output", new Uint8Array(0));
            Mc = b;
            Lc = c
        }
        var Rc = 6, Sc = 32768, Tc = this;
        function Uc(a) {
            var b = a.map(function(a) {
                return a.length
            }).reduce(function(a, b) {
                return a + b
            }), c = new Uint8Array(b), d = 0;
            a.forEach(function(a) {
                c.set(a, d);
                d += a.length
            });
            return c
        }
        function Vc(a, b, c, d) {
            var e = [], g = e.push.bind(e);
            Qc(b, g, l);
            a = Ac(c != k ? c : Rc, a, d || Sc);
            Pc(a);
            return Uc(e)
        }
        function Wc(a, b, c) {
            var d = [], e = d.push.bind(d);
            Qc(b, e, l);
            a = Bc(a, c || Sc);
            Pc(a);
            return Uc(d)
        }
        Tc.deflate = Vc.bind(k, 1);
        Tc.rawDeflate = Vc.bind(k, -1);
        Tc.inflate = Wc.bind(k, 1);
        Tc.rawInflate = Wc.bind(k, -1);
        var Xc = Tc.stream = {};
        function Yc(a, b) {
            var c;
            c = b.level;
            var d = b.chunkSize;
            Qc(b.input, b.streamFn, b.shareMemory);
            c = Ac(c != k ? c : Rc, a, d || Sc);
            Pc(c)
        }
        function Zc(a, b) {
            var c;
            c = b.chunkSize;
            Qc(b.input, b.streamFn, b.shareMemory);
            c = Bc(a, c || Sc);
            Pc(c)
        }
        Xc.deflate = Yc.bind(k, 1);
        Xc.rawDeflate = Yc.bind(k, -1);
        Xc.inflate = Zc.bind(k, 1);
        Xc.rawInflate = Zc.bind(k, -1);
        "undefined" !== typeof define && define.amd ? define("zlib", function() {
            return Tc
        }) : s && (module.exports = Tc);
    
    
    }).call(zlib);
    setZlibBackend({deflate: zlib.deflate,inflate: zlib.inflate,rawDeflate: zlib.rawDeflate,rawInflate: zlib.rawInflate,stream: {deflate: function(a, b, c, d, e) {
                zlib.stream.deflate({input: a,streamFn: b,level: c,shareMemory: d,chunkSize: e})
            },inflate: function(a, b, c, d) {
                zlib.stream.rawInflate({input: a,streamFn: b,shareMemory: c,chunkSize: d})
            },rawDeflate: function(a, b, c, d, e) {
                zlib.stream.rawDeflate({input: a,streamFn: b,level: c,shareMemory: d,chunkSize: e})
            },rawInflate: function(a, b, c, d) {
                zlib.stream.rawInflate({input: a,streamFn: b,shareMemory: c,chunkSize: d})
            }}});
}).call(this);
