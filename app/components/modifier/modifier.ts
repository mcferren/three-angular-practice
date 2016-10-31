import { Component, 
         Input,
         EventEmitter }                 from 'angular2/core';

import { Observable }                   from "rxjs/Observable";

import { MenuComponent }                from '../menu/menu';

import { FDirectionService }            from '../../services/fdirectionService';

@Component({
    selector        : 'modifier',
    templateUrl     : 'app/components/modifier/modifier.html',
    providers       : [ FDirectionService ],
    directives      : [ MenuComponent ]
})
export class ModifierComponent {

    public  whitelist_label  : String = "";
    public  contexttrigger   : EventEmitter<any> = new EventEmitter();
    public  closetrigger     : EventEmitter<any> = new EventEmitter();
    public  activemenu       : Boolean = false;
    public  fetcheddata      : any;

    constructor( private _fdirectionService         : FDirectionService ) {

        let _self = this;

        this.contexttrigger.subscribe(args => {

            _self.triggerMenu( args )
        });

        this.closetrigger.subscribe(args => {

            _self.activemenu = false;
        });
    }

    @Input()
    public set container(value: HTMLElement) {

        if (value)
            this._fdirectionService.init(value, this.contexttrigger);
    }

    public handleWhiteListChange(newString: String) {

        this._fdirectionService.rollWhiteList( this.whitelist_label );
    }

    private triggerMenu( ipaddress ) {

        let _self = this;

        this.fetchLocationData( ipaddress ).subscribe(args => {

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
    }


    private fetchLocationData( ipaddress ) {


        return Observable.create((observer) => { 

        // return this.http.get( 'http://ip-api.com/json/' + ipaddress )
        // return this.http.get( 'http://ip-api.com/json/208.80.152.201' )
        //            .map(res => res.json());

            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'http://ip-api.com/json/' + ipaddress);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    observer.next( JSON.parse( xhr.responseText ) ); 
                    console.log("payload", JSON.parse( xhr.responseText ));
                    observer.complete(); 
                }
                else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                }
            };
            xhr.send();
        });
    }


    public closeMenu() { 

        this.activemenu  = false;
        this.fetcheddata = {};
    }
}
