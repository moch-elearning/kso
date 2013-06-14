var profile = (function(){
	var testResourceRe = /^kso\/tests\//,

		copyOnly = function(filename, mid){
			var list = {
				"kso/profile":1,
				"kso/package.json":1
			};
			return (mid in list) || (/^kso\/css\//.test( filename ) && !/\.css$/.test(filename)) || /(png|jpg|jpeg|gif|tiff)$/.test(filename);
		};

	return {
		resourceTags:{
			test: function(filename, mid){
				return testResourceRe.test(mid) || mid=="kso/robot" || mid=="kso/robotx";
			},

			copyOnly: function(filename, mid){
				return copyOnly(filename, mid);
			},

			amd: function(filename, mid){
				return !testResourceRe.test(mid) && !copyOnly(filename, mid) && /\.js$/.test(filename);
			},

			miniExclude: function(filename, mid){
				return /^kso\/bench\//.test(mid) || /^kso\/themes\/themeTest/.test(mid);
			}
		}
	};
})();



