System.register(['angular2/core'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1;
    var MenuComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            MenuComponent = (function () {
                function MenuComponent() {
                    // @Input() nodedata;
                    this.nodedata = {};
                }
                MenuComponent.prototype.handleCloseClick = function () {
                    this.closetrigger.next(true);
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], MenuComponent.prototype, "nodedata", void 0);
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Object)
                ], MenuComponent.prototype, "closetrigger", void 0);
                MenuComponent = __decorate([
                    core_1.Component({
                        selector: 'cmenu',
                        template: "\n            <div style=\"width:200px;\n                        margin: 70px 10px;\n                        background:red;\n\t\t                outline: 2px solid black;\n\t\t                outline-offset: -8px;\n\t\t                padding: 30px;\n\t\t                overflow: hidden;\n\t\t                position:relative;\">\n\n                <span (click)=\"handleCloseClick($event)\"\n                \t   style=\"font-size:18px;\n\t                          color:white;\n\t                          right:15px;\n\t                          top:10px;\n\t                          cursor:pointer;\n\t                          position:absolute;\">X</span>\n\n\t\t\t\t<ul *ngIf=\"nodedata.status != 'fail'\"\n                     style=\"list-style: none;\n\t\t\t\t\t\t    padding:0;\">\n\t\t\t\t\t<li>city: {{nodedata.city}}</li>\n\t\t\t\t\t<li>country: {{nodedata.country}}</li>\n\t\t\t\t\t<li>countryCode: {{nodedata.countryCode}}</li>\n\t\t\t\t\t<li>isp: {{nodedata.isp}}</li>\n\t\t\t\t\t<li>lat: {{nodedata.lat}}</li>\n\t\t\t\t\t<li>lon: {{nodedata.lon}}</li>\n\t\t\t\t\t<li>org: {{nodedata.org}}</li>\n\t\t\t\t\t<li>query: {{nodedata.query}}</li>\n\t\t\t\t\t<li>region: {{nodedata.region}}</li>\n\t\t\t\t\t<li>regionName: {{nodedata.regionName}}</li>\n\t\t\t\t\t<li>timezone: {{nodedata.timezone}}</li>\n\t\t\t\t\t<li>zip: {{nodedata.zip}}</li>\n\t\t\t\t</ul>\n\n\t\t\t\t<span *ngIf=\"nodedata.status == 'fail'\">Phony IP</span>\n\n\t\t\t\t<a *ngIf=\"nodedata.status != 'fail'\"\n                    href=\"https://www.google.com/maps/place/{{nodedata.lat}},{{nodedata.lon}}\"\n\t\t\t\t    target=\"_blank\"\n\t\t\t\t    style=\"color:white;\n\t\t\t\t    \t\t  text-decoration:underline;\n\t\t\t\t    \t\t  pointer:cursor;\n\t\t\t\t    \t\t  font-weight:700;\">Google Maps Link</a>\n\n            </div>             \n        "
                    }), 
                    __metadata('design:paramtypes', [])
                ], MenuComponent);
                return MenuComponent;
            }());
            exports_1("MenuComponent", MenuComponent);
        }
    }
});
//# sourceMappingURL=menu.js.map