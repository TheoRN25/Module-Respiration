 var menuBtn = document.getElementById("menuBtn");
 var menu = document.getElementById("menu");
 var menuVisible = false;
 
 menuBtn.addEventListener("click", function() {
   if (!menuVisible) {
     menu.classList.add("show");
     menuVisible = true;
   } else {
     menu.classList.remove("show");
     menuVisible = false;
   }
 });
 
 window.addEventListener("click", function(event) {
   if (!menu.contains(event.target) && event.target !== menuBtn) {
     menu.classList.remove("show");
     menuVisible = false;
   }
 });

document.querySelector(".day-night input").addEventListener("change", () => {
  document.querySelector("body").classList.add("toggle");
  setTimeout(() => {
    document.querySelector("body").classList.toggle("light");

    setTimeout(
      () => document.querySelector("body").classList.remove("toggle"),
      10
    );
  }, 5);
});


 
 