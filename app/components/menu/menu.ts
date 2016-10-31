import { Component, 
         Input,
         EventEmitter }                 from 'angular2/core';

@Component({
    selector        : 'cmenu',
    template: `
            <div style="width:200px;
                        margin: 70px 10px;
                        background:red;
		                outline: 2px solid black;
		                outline-offset: -8px;
		                padding: 30px;
		                overflow: hidden;
		                position:relative;">

                <span (click)="handleCloseClick($event)"
                	   style="font-size:18px;
	                          color:white;
	                          right:15px;
	                          top:10px;
	                          cursor:pointer;
	                          position:absolute;">X</span>

				<ul *ngIf="nodedata.status != 'fail'"
                     style="list-style: none;
						    padding:0;">
					<li>city: {{nodedata.city}}</li>
					<li>country: {{nodedata.country}}</li>
					<li>countryCode: {{nodedata.countryCode}}</li>
					<li>isp: {{nodedata.isp}}</li>
					<li>lat: {{nodedata.lat}}</li>
					<li>lon: {{nodedata.lon}}</li>
					<li>org: {{nodedata.org}}</li>
					<li>query: {{nodedata.query}}</li>
					<li>region: {{nodedata.region}}</li>
					<li>regionName: {{nodedata.regionName}}</li>
					<li>timezone: {{nodedata.timezone}}</li>
					<li>zip: {{nodedata.zip}}</li>
				</ul>

				<span *ngIf="nodedata.status == 'fail'">Phony IP</span>

				<a *ngIf="nodedata.status != 'fail'"
                    href="https://www.google.com/maps/place/{{nodedata.lat}},{{nodedata.lon}}"
				    target="_blank"
				    style="color:white;
				    		  text-decoration:underline;
				    		  pointer:cursor;
				    		  font-weight:700;">Google Maps Link</a>

            </div>             
        `
})
export class MenuComponent {

	// @Input() nodedata;
	@Input() nodedata 	  = {};
	@Input() closetrigger;

    constructor() {
    
    }

    public handleCloseClick() {

    	this.closetrigger.next( true );
    }
}
