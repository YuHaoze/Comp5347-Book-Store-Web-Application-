window.onload = function () {
    this.initTable();

    this.document.getElementById('filter-btn').onclick = () => {
        var category = document.getElementById('category').value;
        filter(category);
    }

    this.document.getElementById('search-btn').onclick = () => {
        var keywords = document.getElementById('keyword').value;
        search(keywords.toLowerCase());

    }

    this.document.getElementById('reset').onclick = () => {
        resetCart();
    }

    this.document.getElementById('add').onclick = () => {
        addToCart();
    }

    this.document.getElementById('reset-table').onclick = () => {
        reset();
    }

    this.document.getElementById('dark-btn').onclick = () => {
        switchTheme();
    }
}

/**
 * Get booklist data from json file.
 * @param {*} path 
 * @param {*} success 
 * @param {*} error 
 */
var getJsonObject = (path, success, error) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success) success(JSON.parse(xhr.responseText));
            } else {
                if (error) error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}

/**
 * Initilise booklist, build booklist.
 */
var initTable = () => {
    const tbody = document.getElementById("info");

    bookList = []; // book list container
    getJsonObject('data.json',
        function (data) {
            bookList = data; // store the book list into bookList
            // here you can call methods to laod or refresh the page
            //render booklist's rows
            for (var i in bookList) {
                // console.log(bookList[i].rating)
                var bs = bookList[i].rating
                var stars = "";
                for (var j = 0; j < 5; j++) {
                    if (j < bs)
                        stars += '<img src="images/star-16.ico">';
                    else
                        stars += '<img src="images/outline-star-16.ico">';
                }
                let newRow = document.createElement("tr");
                newRow.innerHTML = "<td colspan='1'><input type=\"radio\" class=\"checkbox\" name=\"checkbox\"></td>" + "<td colspan='1'><img src=\"" +
                    bookList[i].img + "\" height=\"100px\"; width=\"80px\" class=\"img\"></td>" +
                    "<td colspan='1'>" + bookList[i].title + "</td>" +
                    "<td colspan='1'>" + stars + "</td>" +
                    "<td colspan='1'>" + bookList[i].authors + "</td>" +
                    "<td colspan='1'>" + bookList[i].year + "</td>" +
                    "<td colspan='1'>" + bookList[i].price + "</td>" +
                    "<td colspan='1'>" + bookList[i].publisher + "</td>" +
                    "<td colspan='1'>" + bookList[i].category + "</td>";
                newRow.setAttribute("id", "row" + i);
                tbody.append(newRow);
            }

        },
        function (xhr) { console.error(xhr); }
    );
}

/**
 * Filter booklist by category.
 * @param {String} category 
 */
var filter = (category) => {
    showOrHideNoResult(false);

    getJsonObject('data.json', function (data) {
        var booklist = data;
        var info = document.getElementById('info');

        if (category.localeCompare('') === 0) {
            for (index in bookList) {
                document.getElementById('row' + index).style.display = "";
            }
        } else if (category.localeCompare('Test') === 0) {
            showOrHideNoResult(true);
        } else {
            for (index in bookList) {
                if (booklist[index].category.localeCompare(category) === 0) {
                    document.getElementById('row' + index).style.display = "";
                } else {
                    document.getElementById('row' + index).style.display = "none";
                }
            }
        }
    })
}

/**
 * Search books by key words and highlight them.
 * @param {*} keywords 
 */
var search = (keywords) => {
    getJsonObject('data.json', function (data) {
        showOrHideNoResult(false);

        var booklist = data;
        var info = document.getElementById('info');
        var count = 0;

        //user input is available
        if (keywords.localeCompare('') !== 0) {
            for (index in bookList) {
                if (booklist[index].title.toLowerCase().indexOf(keywords) >= 0) {
                    document.getElementById('row' + index).classList.add('highlight');
                    count += 1;
                } else {
                    document.getElementById('row' + index).classList.remove('highlight')
                }
            }
            //unmatched search
            if (count === 0) {
                showOrHideNoResult(true);
            }
        } else {
            for (index in bookList) {
                document.getElementById('row' + index).classList.remove('highlight')
            }
            alert('Please type keywords what you need!');
        }
    })
}


let addToCart = () => {
    var count = parseInt(document.getElementById('cart-num').innerHTML)
    let allElements = document.querySelectorAll(".checkbox");
    allElements.forEach(element => {
        if (element.type == "radio") {
            if (element.checked == true) {
                //TODO: Test user input by regular expression 
                var reg = /^\+?[1-9][0-9]*$/;
                var num = prompt("Please type the quantity of the selected item:", "");
                if (reg.test(num)) {
                    console.log(reg.test(num));
                    count += parseInt(num);
                } else {
                    alert('invalid input');
                }
            }
        }
    });
    document.getElementById('cart-num').innerHTML = count;
    uncheckAll();
}

/**
 * Clear books in cart.
 */
let resetCart = () => {
    var a = confirm("Would you want to reset the cart?");
    if (a == true) {
        document.getElementById('cart-num').innerHTML = '0';
        alert("Shopping cart is empty!");
    }
    uncheckAll();
}

/**
 * Uncheck all books in the booklist. This function is called when user
 * commits to add selected book(s) in to cart.
 */
let uncheckAll = () => {
    let checkboxes = document.querySelectorAll('input[type="radio"]');
    checkboxes.forEach(ele => {
        ele.checked = false;
    })
}

/**
 * Switch page theme between 'light mode' and 'dark mode'.
 */
let switchTheme = () => {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

/**
 * Reset serch and filter results, display all books.
 */
let reset = () => {
    // Reset search bar & filter 
    document.getElementById('keyword').value = '';
    document.getElementById('category').value = '';

    // Rest booklist
    let booklist = document.getElementById('info').children;
    for (let book of booklist) {
        book.style.display = "";
        book.classList.remove('highlight');
    }
}

/**
 * Display no result message. This function is called when there is no
 * search\filter result.
 * 
 * @param {boolean} flag Show 'No book found' if true, hide it when false.
 */
let showOrHideNoResult = function (flag) {
    document.getElementById('info').style.display = flag? 'none': '';
    document.getElementById('no-result').style.display = flag? '': 'none';
}
