// apache. do what you want but don't sue me plz. 

// for performance of multiple inline editors see http://sdk.ckeditor.com/samples/inline.html#sample-2

// it has memory leaks if you try to muck with it's mount location. 
// it's embeddable but don't go crazy with it.

// function bind polyfill:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			// closest thing possible to the ECMAScript 5
			// internal IsCallable function
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		var aArgs	 = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP	= function() {},
			fBound	= function() {
				return fToBind.apply(this instanceof fNOP
					 ? this
					 : oThis,
					 aArgs.concat(Array.prototype.slice.call(arguments)));
			};

		if (this.prototype) {
			// native functions don't have a prototype
			fNOP.prototype = this.prototype; 
		}
		fBound.prototype = new fNOP();

		return fBound;
	};
}

// cms registration. 
( function(window){
	var initdiv = function(div){
		div.setAttribute("contentEditable", true);
		var cms = {};
		cms.locator = encodeURI(div.getAttribute("data-tinycms-id")); 
		// initialize CKEDITOR inline editor.
		// http://docs.ckeditor.com/#!/api/CKEDITOR-method-inline
		cms.editor = CKEDITOR.inline(div, {
			fullPage: false,
			resize_enabled: false,
			removePlugins: 'resize,autogrow'
		});
		// locate where the data is going to go.
		cms.posturl = "edit/" + cms.locator;
		cms.geturl = "view/" + cms.locator;
		cms.instanceReady = function(evt){
			// console.assert(evt.editor === cms.editor);
			// go get the current data for this element.
			jQuery.get(cms.geturl, cms.initWithData.bind(cms));
		};
		cms.initWithData = function(data){
			// first give it to ck, and have it do it's formatting.
			// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-setData
			cms.editor.setData(data);
			// then take it and stick it in our dirty checker.
			// http://docs.ckeditor.com/#!/api/CKEDITOR.editor-method-getData
			cms.data = cms.oldData = cms.editor.getData();
			cms.periodicData();
		}
		// every 1 second, check to see if data has changed. 
		// the user will lose data they edit within (up to) one second
		// of closing the window.
		// http://stackoverflow.com/questions/13922002/how-do-i-save-inline-editor-contents-on-the-server
		cms.periodicData = function(){
			cms.postIfChanged();
			setTimeout( cms.periodicData.bind(cms), 1000 );
		}
		// maybe we can register this with onclose??
		cms.postIfChanged = function(){
			if( ( cms.data = cms.editor.getData() ) !== cms.oldData ){
				cms.oldData = cms.data;
				// no error checking.
				// no csrf doing......
				var postData = {
					'data': cms.data,
					'gorilla.csrf.Token': ''
				};
				jQuery.post(cms.posturl, postData);
			}
		}
		//http://docs.ckeditor.com/#!/api/CKEDITOR-event-instanceReady
		cms.editor.on('instanceReady', cms.instanceReady.bind(cms))
	};
	var windowonload = function(){
		tinycmses = document.querySelectorAll("[data-tinycms-id]");
		for (var i = tinycmses.length - 1; i >= 0; i--) {
			initdiv(tinycmses[i]);
		};
	};
	window.onload = windowonload;
})(window);
