function endTime(mus){
 if (mus.tag==='note') return mus.dur;
    else {
       
    var timeX = endTime(mus.left);
    var timeY = endTime(mus.right);
       
    if (mus.tag=='seq') { return timeX+timeY; }
    else return timeX>timeY ? timeY : timeX;
   
 }
}

function compileT(time,mus){
    if (mus.tag==='note') return [{tag:'note',start:time,dur:mus.dur,pitch:mus.pitch}];
    else {
     var leftTime = endTime(mus);
     return compileT(time,mus.left).concat(
         compileT(mus.tag=='seq' ? leftTime: time,mus.right)
     );
    }
}

var compile = function(mus){
    return compileT(0,mus);
};
