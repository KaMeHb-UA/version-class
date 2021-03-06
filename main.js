
// Documentation

/**
 * Creates new one Version instance
 */
class Version{
    /**
     * @param {String} str String to parse as version
     */
    constructor(str){
        this.channels = {
            alpha: false,
            beta: false,
            stable: false
        };
        this.version = 0;
        this.major = 0;
        this.minor = 0;
        this.revision = '';
        
        /**
         * @return {String} String representation of version
         */
        function toString(){}
        this.toString = toString;
        
        /**
         * @return {Number} Number representation of version (for some reasons compatibility only!)
         */
        function valueOf(){}
        this.valueOf = valueOf;
    };
};

// Factical code

function getVersion(v){
    if (v){
        let res = /(\d+)\.(\d+)\.(\d+)(-[a-z])?/.exec(v);
        if (res && res[1] && res[2] && res[3]) return {

            version : +res[1],
            major : +res[2],
            minor : +res[3],
            revision : (a=>{
                if (a) return a.slice(1,2).charCodeAt(0); else return 65537;
            })(res[4])
        };
    }
    return {
        version : -1,
        major : 0,
        minor : 0,
        revision : 0
    };
}
Version = function(str){
    var shadowVal, _this = {},
        version = getVersion(str);
    function setShadow(){
        shadowVal = new Number(version.version * 16777216 + version.major * 65536 + version.minor * 256 + (version.revision == 65537 || version.revision == 102 ? 255 : version.revision));
        _this.channels = {
            alpha : version.revision >= 97,
            beta : version.revision >= 98,
            stable : version.revision == 102 || version.revision == 65537
        }
        _this.version = version.version;
        _this.major = version.major;
        _this.minor = version.minor;
        _this.revision = version.revision == 65537 ? '' : String.fromCharCode(version.revision);
    }
    var handler = {
        get: function(target, name){
            if(typeof(name) == 'symbol'){
                return shadowVal[name];
            } else if (name == 'valueOf'){
                return ()=>{
                    return shadowVal.valueOf();
                }
            } else if (name == 'toString'){
                return ()=>{
                    return `${_this.version}.${_this.major}.${_this.minor}` + (_this.revision == '' ? _this.revision : '-' + _this.revision);
                }
            } else return _this[name];
        },
        set: (target, name, val)=>{
            if (name == 'version' || name == 'major' || name == 'minor'){
                version[name] = +val;
                setShadow();
            } else if (name == 'revision'){
                version.revision = val.charCodeAt(0);
                setShadow();
            }
        }
    };
    setShadow();
    return new Proxy(shadowVal, handler);
}
module.exports = Version;
