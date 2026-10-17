(function(){
  function show(el,ok,text){el.className="msg "+(ok?"ok":"err");el.textContent=text;}
  document.querySelectorAll("form[data-kind]").forEach(function(f){
    f.addEventListener("submit",function(ev){
      ev.preventDefault();
      var msg=f.querySelector(".msg"),data={},bad=[];
      f.querySelectorAll("input,textarea").forEach(function(i){
        data[i.name]=i.value.trim();
        if(i.required&&!data[i.name])bad.push(i.name);
        if(i.type==="email"&&data[i.name]&&!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(data[i.name]))bad.push(i.name);
      });
      if(bad.length){show(msg,false,"Please check: "+bad.join(", "));return;}
      var btn=f.querySelector("button");if(btn.disabled)return;btn.disabled=true;
      fetch(f.getAttribute("data-endpoint"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)})
        .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
        .then(function(x){btn.disabled=false;show(msg,x.ok,x.j.message||(x.ok?"Sent.":"Something went wrong."));})
        .catch(function(){btn.disabled=false;show(msg,false,"Not sent: this page could not reach its server. Please call or email instead.");});
    });
  });
})();
