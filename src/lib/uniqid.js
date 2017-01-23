/* like mongo but random 1/2^64 chance given two in the same ms. get a life */
module.exports = function(){
	const time = new Date().getTime();
	return (new Date().getTime().toString(16))+
			Array(2).fill(1).map(()=>
				Math.floor(Math.random()*4294967296).toString(16)
			).join('');
}