(function(){var c=document.getElementById("basket"),m=document.getElementById("title"),o=document.getElementById("readme"),p=document.getElementById("report"),i={totalPay:0,dayData:{},monthNum:{},monthPay:{},yearPay:{},suspecial:[],calcCol:"D"};window.conf=i;if(!window.FileReader){c.innerHTML="你的浏览器太老了，换一个浏览器试试。";return}c.addEventListener("dragenter",d,false);c.addEventListener("dragover",d,false);c.addEventListener("dragleave",h,false);c.addEventListener("drop",a,false);document.title+=" by 小乐";m.innerHTML=document.title;o.innerHTML="把“导出获得的xls或xlsx文件”拖放到此处。";function h(){c.classList.remove("dragover")}function d(q){c.classList.add("dragover");q.stopPropagation();q.preventDefault()}function a(q){file=q.dataTransfer.files;q.stopPropagation();q.preventDefault();if(!file.length){c.innerHTML="文件拖放动作有问题，重试一次。";h();return}k(file[0])}function k(r){if(r.name.match(/\.xls.?$/)){var q=new FileReader();q.onload=function(w){var v=w.target.result;var s=XLSX.read(v,{type:"binary"});var u=s.Sheets[Object.keys(s.Sheets)[0]],t=+u["!ref"].match(/(\d+)/g)[1],z,y;for(y=1;y<=t;y++){if(u["A"+y]&&u["A"+y].v==="项目名称"){z=y+1;i.calcCol=u["C"+y].v==="本金(元)"?"C":"D";break}}if(z){l(u,z,t);c.style.display="none"}else{c.innerHTML="你拖放的xls不是微贷散标导出文件。";h()}};q.readAsBinaryString(r)}else{c.innerHTML="你拖放的不是xls文件，重试一次。"}h()}function e(q){return Math.round(+q*100)/100}function n(q){return q.replace("-","年")+"月"}function l(E,t,s){var P=i.dayData,I=i.monthPay,K=i.monthNum,L=i.yearPay,u=i.suspecial,H;for(H=t;H<=s;H++){var r=E["A"+H].v.match(/抵|械/),M=E["B"+H].v.slice(-10),G=M.slice(0,-3),B=G.slice(0,-3),D=E[i.calcCol+H].v,F=P[M]||{pay:0,credit:0,num:0,bnum:0,bpay:0};P[M]=F;F.pay=e(F.pay+D);F.credit=F.credit+(+!r);F.num=F.num+1;F.bnum=F.bnum+ +(D>100);F.bpay=F.bpay>D?F.bpay:D;I[G]=e((I[G]||0)+D);K[G]=e((K[G]||0)+1);L[B]=e((L[B]||0)+D);i.totalPay=e(i.totalPay+D)}var w=(new Date).getMonth()+1,A=[1,3,5,7,8,10,12].filter(function(v){return v>w})[0]||1,N=0,z=[];for(H=t;H<=s;H++){var C=+E["B"+H].v.slice(-10).slice(0,4),O=+E["B"+H].v.slice(-5).slice(0,2),J=+E["B"+H].v.slice(-2);if(O===A&&(C===N||N===0)){N=C;z[J]=z[J]||[];z[J].push(E["A"+H].v)}}var q;for(J=1;J<=31;J++){u[J]=[];while(q=z[J].pop()){if(z[J].includes(q)&&!u[J].includes(q)&&q.match(/抵/)){u[J].push(q)}}}i.lastPayDay=E["B"+s].v.slice(-10);f();b()}function f(){var v=echarts.init(document.getElementById("chart"),"light"),A,w,B=[],z=[],s=0;for(A in i.yearPay){B.push({value:i.yearPay[A],name:A+"年 "+e(i.yearPay[A]/i.totalPay*100)+"%"})}w=0;for(A in i.monthPay){s=e(s+i.monthPay[A]);z.push({value:Math.floor(s/i.totalPay*100)+"%",name:"进度: "+e(s/i.totalPay*100)+"%",xAxis:w++,yAxis:i.monthPay[A]})}var r={title:{},tooltip:{},legend:{},xAxis:{splitNumber:Object.keys(i.monthPay).length,axisLabel:{interval:0},data:Object.keys(i.monthPay).map(function(C){return{value:C.match(/-01/)?C.slice(0,-3)+"年":C.slice(-2)+"月",textStyle:{fontSize:10}}})},yAxis:{},series:[{name:"月回款",type:"line",lineStyle:{color:"#600"},smooth:true,data:Object.values(i.monthPay)},{name:"月回款",type:"bar",markPoint:{symbol:"pin",data:z,symbolSize:[1,30],label:{color:"#333",fontSize:10},itemStyle:{color:"#fff",}},label:{show:true,position:"insideBottom",rotate:45,offset:[2,-8],fontSize:8},data:Object.values(i.monthPay)},{name:"年回款",type:"pie",radius:"40%",center:["70%","35%"],data:B}]};v.setOption(r);var q=["回款分析："];q.push("");q.push("待还总本金金额："+i.totalPay+"元");q.push("共有待执行合同："+Math.max.apply(Math,Object.values(i.monthNum))+"个");q.push("最后一笔回款时间："+i.lastPayDay.replace(/-(\d\d)-(\d\d)/,"年$1月$2日"));q.push("");for(A in i.yearPay){q.push(A+"年还款："+i.yearPay[A]+"元，占比"+e(i.yearPay[A]/i.totalPay*100)+"%")}q.push("");s=0;for(A in i.monthPay){s=e(s+i.monthPay[A]);q.push(n(A)+"还款："+i.monthPay[A]+"元("+e(i.monthPay[A]/i.totalPay*100)+"%)；"+"累计还款："+s+"元("+e(s/i.totalPay*100)+"%)；"+"执行合同数:"+i.monthNum[A]+"个")}q.push("");q.push("一车多合同存疑分析：");var y,u=[],t=i.suspecial;for(y=1;y<=31;y++){if(t[y].length){u.push("关注"+y+"日还款的合同: "+t[y].join(" 和 "))}}q.push(u.length?u.join("<br>\n"):"没有存疑合同");q.push("");q.push("");p.innerHTML=q.join("<br>\n")}function j(q){var r=new Date(+(new Date(q))+1000*60*60*24);return r.getFullYear()+("0"+(r.getMonth()+1)).slice(-2)+("0"+r.getDate()).slice(-2)}function g(q){return q.replace(/-/g,"")}function b(){var q=document.createElement("a"),r=[];r.push("BEGIN:VCALENDAR");r.push("METHOD:PUBLISH");r.push("VERSION:2.0");r.push("X-WR-CALNAME:微贷");r.push("X-APPLE-CALENDAR-COLOR:#660000");r.push("X-WR-TIMEZONE:Asia/Shanghai");r.push("CALSCALE:GREGORIAN");for(x in i.dayData){r.push("BEGIN:VEVENT");var s=i.dayData[x];r.push("SUMMARY:还款"+s.pay+"元");r.push("DESCRIPTION:"+["今日还款"+s.pay+"元","执行合同"+s.num+"个","信用标"+s.credit+"个","抵押标"+(s.num-s.credit)+"个","大于100元的标"+s.bnum+"个","最大还款标"+s.bpay+"元"].join("\\n"));r.push("DTSTART;VALUE=DATE:"+g(x));r.push("DTEND;VALUE=DATE:"+j(x));r.push("SEQUENCE:1");r.push("END:VEVENT")}r.push("END:VCALENDAR");q.innerHTML="导出还款日历";q.download="微贷.ics";q.href=URL.createObjectURL(new Blob([r.join("\n")]));p.appendChild(q)}}());