/* Cookie JS */

export function cookie(){
    cookie.prototype.set = function(cname, cvalue, exdays = 1, path = '/') {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path="+path;
    }

    cookie.prototype.get = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    cookie.prototype.has = function (name) {
        var val = this.get(name);
        if (val != "") {
            return true;
        } else {
            return false;
        }
    }
}

export var Cookie = new cookie();