System.register(['angular2/core', "rxjs/Observable", '../menu/menu', '../../services/fdirectionService'], function(exports_1, context_1) {
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
    var core_1, Observable_1, menu_1, fdirectionService_1;
    var ModifierComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (Observable_1_1) {
                Observable_1 = Observable_1_1;
            },
            function (menu_1_1) {
                menu_1 = menu_1_1;
            },
            function (fdirectionService_1_1) {
                fdirectionService_1 = fdirectionService_1_1;
            }],
        execute: function() {
            ModifierComponent = (function () {
                function ModifierComponent(_fdirectionService) {
                    this._fdirectionService = _fdirectionService;
                    this.whitelist_label = "";
                    this.contexttrigger = new core_1.EventEmitter();
                    this.closetrigger = new core_1.EventEmitter();
                    this.activemenu = false;
                    var _self = this;
                    this.contexttrigger.subscribe(function (args) {
                        _self.triggerMenu(args);
                    });
                    this.closetrigger.subscribe(function (args) {
                        _self.activemenu = false;
                    });
                }
                Object.defineProperty(ModifierComponent.prototype, "container", {
                    set: function (value) {
                        if (value)
                            this._fdirectionService.init(value, this.contexttrigger);
                    },
                    enumerable: true,
                    configurable: true
                });
                ModifierComponent.prototype.handleWhiteListChange = function (newString) {
                    this._fdirectionService.rollWhiteList(this.whitelist_label);
                };
                ModifierComponent.prototype.triggerMenu = function (ipaddress) {
                    var _self = this;
                    this.fetchLocationData(ipaddress).subscribe(function (args) {
                        _self.fetcheddata = args;
                        _self.activemenu = true;
                        // if( _self.cmpRef ) { _self.cmpRef.destroy(); }
                        // let factory = this.componentFactoryResolver.resolveComponentFactory( SSSIframeComponent ); 
                        // _self.cmpRef = this.contexttarget.createComponent( factory, 0, this.contexttarget.injector );
                        // _self.cmpRef.instance.city            = args.city;
                        // _self.cmpRef.instance.country         = args.country;
                        // _self.cmpRef.instance.countryCode     = args.countryCode;
                        // _self.cmpRef.instance.isp             = args.isp;
                        // _self.cmpRef.instance.lat             = args.lat;
                        // _self.cmpRef.instance.lon             = args.lon;
                        // _self.cmpRef.instance.org             = args.org;
                        // _self.cmpRef.instance.query           = args.query;
                        // _self.cmpRef.instance.region          = args.region;
                        // _self.cmpRef.instance.regionName      = args.regionName;
                        // _self.cmpRef.instance.timezone        = args.timezone;
                        // _self.cmpRef.instance.zip             = args.zip;
                    });
                };
                ModifierComponent.prototype.fetchLocationData = function (ipaddress) {
                    return Observable_1.Observable.create(function (observer) {
                        // return this.http.get( 'http://ip-api.com/json/' + ipaddress )
                        // return this.http.get( 'http://ip-api.com/json/208.80.152.201' )
                        //            .map(res => res.json());
                        var xhr = new XMLHttpRequest();
                        xhr.open('GET', 'http://ip-api.com/json/' + ipaddress);
                        xhr.onload = function () {
                            if (xhr.status === 200) {
                                observer.next(JSON.parse(xhr.responseText));
                                console.log("payload", JSON.parse(xhr.responseText));
                                observer.complete();
                            }
                            else {
                                console.log('Request failed.  Returned status of ' + xhr.status);
                            }
                        };
                        xhr.send();
                    });
                };
                ModifierComponent.prototype.closeMenu = function () {
                    this.activemenu = false;
                    this.fetcheddata = {};
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', HTMLElement), 
                    __metadata('design:paramtypes', [HTMLElement])
                ], ModifierComponent.prototype, "container", null);
                ModifierComponent = __decorate([
                    core_1.Component({
                        selector: 'modifier',
                        templateUrl: 'app/components/modifier/modifier.html',
                        providers: [fdirectionService_1.FDirectionService],
                        directives: [menu_1.MenuComponent]
                    }), 
                    __metadata('design:paramtypes', [fdirectionService_1.FDirectionService])
                ], ModifierComponent);
                return ModifierComponent;
            }());
            exports_1("ModifierComponent", ModifierComponent);
        }
    }
});
//# sourceMappingURL=modifier.js.map