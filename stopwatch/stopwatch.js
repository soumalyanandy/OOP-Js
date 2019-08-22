function StopWatch(){
	//this.time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
	this.showCurrentTime = function(){
		console.log(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
	};
	//Object.defineProperty(this, '')
	this.duration = 0;
	this.running = false;
	this.startTime = 0;
	this.endTime = 0;
	this.startTimer = function(){
		if(!this.running){
			this.running = true;
			this.startTime = new Date().getTime();
		} else {
			throw new Error("StopWatch has been already started.");
		}
	};
	this.stopTimer = function(){
		if(this.running){
			this.running = false;
			this.endTime = new Date().getTime();
			let diff = (this.endTime - this.startTime);
			this.duration+=parseFloat((diff/1000).toFixed(2)); //seconds
		} else {
			throw new Error("StopWatch is not running.");
		}
	};
	this.result = function(){
		console.log(this.duration);
	};
	this.resetTimer = function(){
		this.duration = 0;
		this.running = false;
		this.startTime = 0;
		this.endTime = 0;
	}
}
