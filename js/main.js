var cartItems;
var baseUrl="data/";
$(document).ready(function(){

    //cartLength
    cartLength();
    //search
    $("#search").keyup(searchByAlbumName);
    //sort
    $("#ddlListSort").change(sortPriceName);
    //radio button category
    $("#radioB").change(filterCategory);
    //filter artist
    $("#ddlListArtist").change(filterArtist);
   
    // handle click on paging links
    $('.tm-paging-link').click(function(e){
        e.preventDefault();

        var page = $(this).text().toLowerCase();
        $('.tm-gallery-page').addClass('hidden');
        $('#tm-gallery-page-' + page).removeClass('hidden');
        $('.tm-paging-link').removeClass('active');
        $(this).addClass("active");
    });

    //funkcija za toggle
    function addToggle(divHideShow, divShow){
        $(divHideShow).hide();
        $(divShow).click(function(e){
            e.preventDefault();
            $(divHideShow).slideToggle(1000);
        });
    }
    addToggle("#textFade", "#showText");
    addToggle("#textFade2", "#showText2");

    //funkcija za hover
    $("#products").hover( function(){
        $(this).css({
            "transform": "translate3d(0, -3px, 0)",
            "box-shadow": "0 1px 2px rgba(0,0,0,0.25)",
            "transition": "0.3s"})
    }, function(){
        $(this).css({
            "transform": "translate3d(0, 0, 0)",
            "box-shadow": "0 1px 1px rgba(0,0,0,0.2)"})
    })

    //regularni izrazi
    $(document).on("click", "#buttonSubmit", function(){

    var valid=true;
    var valueFistName=$("#nameInput");
    var valueLastName=$("#lastNameInput");
    var valueEmali=$("#emailInput");
    var valueMesage=$("#messageInput");

    var fullNameRegex=/^[A-ZČĆŽŠĐ][A-Za-zčćžšđ\s]{2,15}$/;
    var eMailRegex=/^[a-z0-9]+(\.[a-z0-9]+)*@[a-z0-9]+(\.[a-z0-9]+)*(\.[a-z]{2,3})$/;
    var messageRegex=/^[A-ZČĆŽŠĐ][a-zčćžšđ\s\.,!?]{11,300}$/;

    //funkcija za proveru regexa
    function formCheck(inputValue, errorSpan, text, regex){
        if(inputValue.val()==""){
            valid=false;
            inputValue.addClass("error");
            $(errorSpan).html("You need to fill out this field.");
        }
        else{
            if(!regex.test(inputValue.val())){
                valid=false;
                inputValue.addClass("error");
                $(errorSpan).html(text);
            }
            else{
                inputValue.removeClass("error");
                $(errorSpan).html("");
            }
        }
    }
    //firstName
    formCheck(valueFistName, "#errorFirstName", "Name not in a good format - start with upper case leading up to at least 3 letters." ,fullNameRegex);

    //lastName
    formCheck(valueLastName, "#errorLastName", "Last name not in a good format - start with upper case leading up to at least 3 letters.", fullNameRegex);

    //email
    formCheck(valueEmali, "#errorEmail", "Please enter a valid email address.", eMailRegex);

    //message
    formCheck(valueMesage, "#errorMsg", "Message must have at least 12 letters with first letter upper case.", messageRegex);

    if(valid){
        $("#done").html("Thank you for your opinion.");
    }
    })

    // skladistenje u Local Storage
    function setItemToLocalStorage(name, value){
        localStorage.setItem(name, JSON.stringify(value));
    }
    // vracanje iz Local Storage
    function getItemFromLocalStorage(name){
        return JSON.parse(localStorage.getItem(name));
    }

    //ajaxCallBack funckija
    function ajaxCallBAck(url, method, result){
        $.ajax({
            url:url,
            method:method,
            dataType:"json",
            success:result,
            error:function(xhr, status){
                if(xhr.status==404){
                        alert(`Sorry, ${status} ${xhr.status}. Page can not be found. Try again later.`)
                }
                if(xhr.status==500){
                    alert(`Sorry, ${status} ${xhr.status}. Server error.`)
                }
            }
        });
    }
    
    //dohvatanje menu.json
    ajaxCallBAck(baseUrl+"menu.json", "get", function(result){
         writeMenu(result);
    })

     //dohvatanje socialICons.json
     ajaxCallBAck(baseUrl+"socialIcons.json", "get", function(result){
        //console.log(result);
        writeSocialIcons(result);
    })

   //dohvtanje products.json
   ajaxCallBAck(baseUrl+"products.json", "get", function(result){
    writeProducts(result);
    setItemToLocalStorage("products", result);
    })

    //dohvatanje artist.json
    ajaxCallBAck(baseUrl+"artist.json", "get", function(result){
        setItemToLocalStorage("artist", result);
    })

    //dovatanje category.json
    ajaxCallBAck(baseUrl+"category.json", "get", function(result){
        setItemToLocalStorage("category", result);
        writeRB(result);
    })

    //dohvatanje opstions.json
    ajaxCallBAck(baseUrl+"options.json", "get", function(result){
        setItemToLocalStorage("options", result);
    })

    //funkcija za ispisivanje menija
    function writeMenu(menuArray){
        var html="";
        menuArray.forEach(obj => {
            html+=`<li class="tm-nav-li"><a href="${obj.href}" class="tm-nav-link" target="${writeBlank(obj.href)}">${obj.name}</a></li>`
        })
        $("#menu").html(html);
    }

    //funkcija za otvaranje documentation.pdf na drugoj strani
    function writeBlank(objHref){
        if(objHref=="documentation.pdf"){
            return "_blank";
        }
        else{
            return "";
        }
    }

    //funkcija za ispis dinamickih fa-fa ikonica
    function writeSocialIcons(iconsArray){
        var html2="";
        for(var obj2 of iconsArray){
            html2+=`<a href="${obj2.href}" target="_blank" class="tm-social-link"><i class="${obj2.faFa} tm-social-icon"></i></a>`
        }
        $("#socialIcons").html(html2);
    }

    //funkcija za ispisivanje proizvoda
    function writeProducts(productsArray){
        var html3="";
        if(productsArray.length==0){
            html3+=`<div class="col-12">
                <div class="alert text-center mt-5">Sorry, we will be back in stock soon with new arrivals.</div>
            </div>`
        }
        else{
            for(obj3 of productsArray){
                html3+=`<article class="col-lg-3 col-md-4 col-sm-6 col-12 tm-gallery-item">
                <figure class="text-center">
                    <img src="img/gallery/${obj3.picture.src}" alt="${obj3.picture.alt}" class="img-fluid tm-gallery-img animatePic" />
                    <figcaption">
                        <h4 class="tm-gallery-title">${obj3.name}</h4>
                        <p>Artist - ${writeArtist(obj3.idArtist)} </p>
                        <p>${writeCat(obj3.idCat)}</p>
                        <hr>
                        <p class="text-secondary">${writeDelivery(obj3.delivery)}</p>
                        <input type="button" value="Add to cart" class="tm-btn tm-btn-success addToCart"  data-idcart="${obj3.id}"/>
                        <p class="tm-gallery-price">${writePrice(obj3.price)}</p>
                    </figcaption>
                </figure>
            </article>`
            }
        }
         $("#products").html(html3);
         $('.addToCart').click(toCart);
         location.reload;
    }

    //funkcije za korpu na shop.html
    function cartLength(){
        var cartItems=getItemFromLocalStorage("cartItems");
        if(cartItems!=null){
            var nmbOfProd=cartItems.length;
            $("#countCart").html(nmbOfProd);
        }
    }
    if(document.URL.includes("shop.html")){
    
        function toCart(){
            var idCart=$(this).attr('data-idcart');
            var currentLS=catchAll();
            var objectProduct=products.filter(p=>p.id==idCart);
            if(!currentLS){
                notInCurrentLS(objectProduct);
            }
            else{
                var isInCart=currentLS.some(s=>s.id==idCart);
                if(!isInCart){
                    notInCart(objectProduct, currentLS);
                }
                else{
                    alreadyExists(currentLS, idCart);
                }
                setItemToLocalStorage("cartItems", currentLS);
                cartLength();
            }
            alertAddToCart();
        }

        function alertAddToCart(){
            alert("Album has been added to the cart.");
        }

        function catchAll(){
            return getItemFromLocalStorage("cartItems");
        };

        function notInCurrentLS(objectProduct){
            objectProduct[0].quantity=1;
            setItemToLocalStorage("cartItems", objectProduct);
            cartLength();
        }

        function notInCart(objectProduct, currentLS){
            objectProduct=objectProduct[0];
            objectProduct.quantity=1;
            currentLS.push(objectProduct);
            cartLength();
        }

        function alreadyExists(currentLS, idCart){
            currentLS=currentLS.map(m=>{
                if(m.id == idCart){
                    m.quantity+=1;
                }
                return m;
            });
        }
    }

    //funckije za korpu na cart.html
    if(document.URL.includes("cart.html")){
        var cartItems=getItemFromLocalStorage("cartItems")
        if(cartItems==null){
            $("#cartEmpty").html("Your cart is empty - go back to shopping.");
        }
        else{
            checkCart();
        } 
    
        function checkCart(){
            var cartItems=getItemFromLocalStorage("cartItems");
            html8="";
            html8+=`<table id="cart" class="table table-hover table-condensed">
            <thead>
            <tr>
                <th class="col-5 ">Product</th>
                <th class="col-2">Price</th>
                <th  class="col-1">Quantity</th>
                <th  class="col-3 text-center">Total</th>
                <th  class="col-2">Remove</th>
            </tr>
            </thead>`
            for(var obj7 of cartItems){
                html8+=` <tbody> 
                <tr>
                    <td data-th="Product">
                            <div class="col-sm-2 hidden-xs mr-5" >
                                <img src="img/gallery/${obj7.picture.src}" alt="${obj7.picture.alt}" class="img-responsive"/>
                            </div>
                            <div class="col-sm-5">
                                <h5>${obj7.name}</h5>
                            </div>
                    </td>
                    <td data-th="Price">$${obj7.price.priceNow}</td>
                    <td data-th="Quantity">
                        <p id=${obj7.quantity} class="text-center">${obj7.quantity}</p>
                    </td>
                    <td data-th="Total" class="text-center">$${(obj7.price.priceNow * obj7.quantity)}</td>
                    <td class="actions" >
                        <a href="#" class="tm-btn tm-btn-success remove" data-id="${obj7.id}" >Remove</a>
                    </td>
                </tr> 
            </tbody>`
            }
            html8+=`<tfoot>
            <tr>
                <td><a href="shop.html#shop" class="tm-btn tm-btn-success"><i class="fa fa-angle-left"></i>Back</a></td>
                <td colspan="1" class="hidden-xs"></td>
                <td><a href="#" class="tm-btn tm-btn-success" id="clear">Clear</a></td>
                <td class="text-center"><strong>Total $${totalCost()}</strong></td>
                <td><a href="#" class="tm-btn tm-btn-success" id="finish">Finish</a></td>

            </tr>
        </tfoot>
        <table>`
            $("#cartWrite").html(html8);
        }

        $("#finish").click(alertFinish);
        $("#clear").click(clearCartAll);
        $(".remove").click(removeCartItem);
        $(".quantity").keyup(quantityCheck);

        function alertFinish(e){
            e.preventDefault();
            alert("Thank you for supporting us. Your shipping code and information about paying will be sent to your email.");
            localStorage.removeItem("cartItems");
            location.reload();
        }
        
        function clearCartAll(e){
            e.preventDefault();
            localStorage.removeItem("cartItems");
            location.reload();
        }

        function removeCartItem(e){
            e.preventDefault();
            var cartItems=getItemFromLocalStorage("cartItems");
           
            var idR=$(this).attr("data-id");
            var removeFilter=cartItems.filter(c=>c.id!=idR);
        
            setItemToLocalStorage("cartItems", removeFilter);
            location.reload();
        }

        function quantityCheck(){
            console.log("jj")
            if(! /([0-9])/g.test($(this).val()) && $(this).val()!=""){
                alert("Only numbers please!");
                return "";
            }
            else{
                var valueQ=$(this).val();
                console.log(valueQ);
                return valueQ; 
            }
        }

        function totalCost(){
            for(var obj8 of cartItems){
                if(cartCost!=null){
                    setItemToLocalStorage("totalCost", getItemFromLocalStorage("totalCost") + obj8.price.priceNow * obj8.quantity);
                }
                else{
                    setItemToLocalStorage("totalCost", obj8.price.priceNow * obj8.quantity);
                }
                var cartCost=getItemFromLocalStorage("totalCost");
            }
            if(cartCost!=null){
                return cartCost;
            }
            else{
                return 0;
            }
        }
    }

    //dohvatanje artista
    var artist=getItemFromLocalStorage("artist");
    function writeArtist(idArtist){
        var name=artist.filter(a=>a.id==idArtist)[0].name;
        return name;
    }

    //dohvatanje kategorije
    var category=getItemFromLocalStorage("category");
    function writeCat(idCat){
        var catName=category.filter(c=>c.id==idCat)[0].catName;
        return catName;
    }

    //funkcija za ispisivanje dostave
    function writeDelivery(delivery){
        var html4="";
        if(delivery){
            html4+=`Free delivery`
        }
        else{
            html4="";
        }
        return html4;
    }

    //funkcija za ispisivanje cene
    function writePrice(price){
        var html5="";
        if(price.priceOld!=null){
            html5+=`$${price.priceNow}  <del>$${price.priceOld}</del>`
        }
        else{
            html5+=`$${price.priceNow}`
        }
        return html5;
    }

    //funkcija za pretrazivanje
    var products=getItemFromLocalStorage("products");
    function searchByAlbumName(){
        var valueInput=$("#search").val().toLowerCase();
        if(valueInput){
            var filtered= products.filter(function(p){
                if(p.name.toLowerCase().indexOf(valueInput)!==-1){
                    return true;
                }
            });
            writeProducts(filtered);
        }
    }

    //funkcija za ispis padajuce liste
    function writeDDL(array, div, text){
        html="";
        html+=`<option value="0">${text}</option>`
        for(var obj4 of array){
            html+=`<option value="${writeValueOrId(obj4, array)}">${obj4.name}</option>`
        }
        $("#"+div).html(html);
    }

    function writeValueOrId(obj4, array){
        if(array==options){
            return obj4.name;
        }
        else{
            return obj4.id;
        }
    }

    //ispis padajucih lista
    var options=getItemFromLocalStorage("options");
    writeDDL(options, "ddlListSort", "Sort by");
    writeDDL(artist, "ddlListArtist", "Choose an artist");


    //funkcija za ispis radio buttona
    function writeRB(catArray){
        var html6="";
       for(var obj5 of Object.keys(catArray)) {
            html6+=`<div class="form-check form-check-inline">
            <input class="form-check-input rb" name="rb" type="radio" value="${catArray[obj5].id}">
            <label class="form-check-label" for="${catArray[obj5].id}">${catArray[obj5].catName}</label>
          </div>`
        }
        $("#radioB").html(html6);
    }

    //sortiranje
    function sortPriceName(){
        var valueOption=document.getElementById("ddlListSort").value;
        if(valueOption == "Album name-A-Z"){
            products.sort(function(a,b){
                if(a.name > b.name){
                    return 1;
                }
                else if(a.name < b.name){
                    return -1;
                }
                else{
                    return 0;
                }
            })
        }
        if(valueOption=="Album name-Z-A"){
            products.sort(function(a,b){
                if(a.name > b.name){
                    return -1;
                }
                else if(a.name < b.name){
                    return 1;
                }
                else{
                    return 0;
                }
            })
        }
        if(valueOption=="Low to High price"){
            products.sort(function(a,b){
                return a.price.priceNow - b.price.priceNow
            })
        }
        if(valueOption=="High to Low price"){
            products.sort(function(a,b){
                return b.price.priceNow - a.price.priceNow
            })
        }
        writeProducts(products);
    }

    //funkcija za filtiranje kategorija
    function filterCategory(){
        var valueRadio=$(".rb:checked").val();
         var filteredCat=products.filter(p=>p.idCat==valueRadio);
         writeProducts(filteredCat);
    }

    //funkcija za filtriranje artista
    function filterArtist(){
        var valueOptionArtist=document.getElementById("ddlListArtist").value;
        var filteredArtist=products.filter(s=>s.idArtist==valueOptionArtist);
        writeProducts(filteredArtist);
    }

});

