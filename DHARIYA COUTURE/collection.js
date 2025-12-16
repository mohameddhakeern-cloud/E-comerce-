//sidenav bar

var sidenav = document.querySelector(".side-navbar")

function openNav(){
    sidenav.style.left ="0"
}
function closeNav(){
    sidenav.style.left ="-60%"

}

//search bar

var productContainer = document.getElementById("product")
var search = document.getElementById("search")
var productlist = productContainer.querySelectorAll("div")

search.addEventListener("keyup",function(){
    var enteredValue = event.target.value.toUpperCase()

    for (count = 0; count < productlist.length; count = count + 1){
        var productname = productlist[count].querySelector("p").textContent

        if(productname.toUpperCase().indexOf(enteredValue)<0)
        {

            productlist[count].style.display ="none"
        } 
        else{
            productlist[count].style.diplay ="block"
        }
    }
})
   