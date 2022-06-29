
// for enabling a button only when there is text in texarea
$("#posttextarea, #replytextarea").keyup(event => {
    var textbox =$(event.target);
    var value =textbox.val().trim();

    //to check if it's a modal: if yes=> then go for the reply button
    //else click submit button

    //so here if are checking parent of element  "textbox", if anyone has the class 'modal'
    var ismodal=textbox.parents(".modal").length == 1;
    //length== 1 if it does otherwise 0
    
    var submitButton = ismodal ? $("#submitreplybutton") : $("#submitpostbutton");

    if(submitButton.length == 0) {
        return alert("no submit button found");
    }

    if(value =="") {
        submitButton.prop("disabled", true);
        return;
    }
    submitButton.prop("disabled", false);
})

//for posting the entered content
$("#submitpostbutton").click((event) => {
    var button = $(event.target);
    var textbox = $("#posttextarea");

    var data = {
        content: textbox.val()
        
    }

    // ajax request
    $.post(`/api/posts` , data , (postData , status, xhr) => {
        var html = createposthtml(postData);
        $(".postContainer").prepend(html);
        //appends = adds to the end of element
        //prepend= adds to the front of the element

        //again making the textbox blank
        textbox.val("");
        button.prop("disabled", true);
    })
})


//for likes
$(document).on("click" , ".likebutton" ,(event) => {
    var button = $(event.target);
    var postid = getpostidfromelement(button);
    console.log(postid);
    
    if(postid === undefined) return;
    //for PUT REQUEST
    $.ajax({
        url: `/api/posts/${postid}/like`,
        type: "PUT",
        success: (postData) => {
            console.log(postData.likes.length);
            button.find("span").text(postData.likes.length || "")


            //check if userLoggedIn id exists in likes array
            if(postData.likes.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active")
            }

            //now what this does is it adds class="active" with class="likebutton" so that we can style it like making it red when we click it,etc

        }
    })
    
})

//for retweets
$(document).on("click" , ".retweetbutton" ,(event) => {
    var button = $(event.target);
    var postid = getpostidfromelement(button);
    
    if(postid === undefined) return;
    //retweet means new post
    $.ajax({
        url: `/api/posts/${postid}/retweet`,
        type: "POST",
        success: (postData) => {
            button.find("span").text(postData.retweetusers.length || "")
            if(postData.retweetusers.includes(userLoggedIn._id)) {
                button.addClass("active");
            }
            else {
                button.removeClass("active")
            }

        }
    })
    
})


//for delete

$(document).on("click" , ".deletebutton" ,(event) => {
    
    var button = $(event.target);
    var postid = getpostidfromelement(button);
    $("#deletepostmodal").data("id", postid);    
})

$("#submitdeletepostbutton").click((event) => {
    var postid=$("#deletepostmodal").data("id");
    $.ajax({
        url: `/api/posts/${postid}`,
        type: "DELETE",
        success: (postData) => {
           location.reload();
        }
    })  
})

function getpostidfromelement(element) {
    //to check if the element selected is a root element or not
    var isroot = element.hasClass("post");
    var rootelement = isroot == true ? element : element.closest(".post"); //finding the nearest element to class post
    var postid = rootelement.data().id; // data function gives you all the data of that element

    if(postid === undefined){
        return alert("post id is undefined");
    }
    return postid;
}

function createposthtml(postData) {

    if(postData == null ) return alert("post object is null");

    //to check if reweet data exists or not
    var isretweet = postData.retweetdata !== undefined;
    //retweet is either true(when retweetdata is not null) and false(when retweet data is null)
    
    var retweetedby = isretweet ? postData.postedBy.username : null;
    console.group(retweetedby);

    //setting postdata as the retweet data
    postData = isretweet ? postData.retweetdata : postData ;


    var postedBy = postData.postedBy;

    if(postedBy._id === undefined ) {
        return console.log("user object not populated");
    }

    var displayname = postedBy.firstname + " " + postedBy.lastname;
    var timestamp = timeDifference(new Date(), new Date(postData.createdAt));

    //setting the buttons' colours when the page gets loaded
    var likebuttonactiveclass = postData.likes.includes(userLoggedIn._id) ? "active" : "";
    var retweetbuttonactiveclass = postData.retweetusers.includes(userLoggedIn._id) ? "active" : "";

    var retweettext = '';
    if(isretweet) {
        retweettext =`<span>
                        <i class="fas fa-share"></i>
                        Retweeted By <a href='/profile/${retweetedby}' class="username">@${retweetedby}</a>
                    </span>`

    }  

    //delete button
    var buttons="";
    
    if(postData.postedBy._id == userLoggedIn._id) //means that the post belongs to the user who logged in
    {
        buttons =`<button class="deletebutton" data-id="${postData._id}" data-toggle="modal" data-target="#deletepostmodal">
        <i class='fas fa-trash'></i>
        <span class="deletetooltip">Delete</span>
        </button>`
    }

    //html for the posts
    return `<div class="post" data-id='${postData._id}'>
                <div class='postactioncontainer'>
                    ${retweettext}
                </div>
                <div class="maincontentcontainer">
                    <div class="userImageContainer">
                    <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postcontentcontainer">
                        <div class="header">
                            <a href='/profile/${postedBy.username}' class="displayname">${displayname}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="date">${timestamp}</span>
                        </div>
                        <div class="postbody">
                        <span>${postData.content}</span>
                        </div>
                        <div class="postfooter">
                            <div class="postbuttoncontainer red">
                                <button class="likebutton ${likebuttonactiveclass} ">
                                    <i class="fas fa-heart"></i> 
                                    <span> ${postData.likes.length || ""}</span>
                                    <span class="liketooltip">Like</span>
                                </button>
                            </div>
                            <div class="postbuttoncontainer blue">
                                <button class="retweetbutton ${retweetbuttonactiveclass}">
                                    <i class="fas fa-share"></i>
                                    <span> ${postData.retweetusers.length || ""}</span>
                                    <span class="retweettooltip">Retweet</span>
                                </button>
                            </div>
                            <div class="postbuttoncontainer black" >
                            ${buttons}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}


function timeDifference(current, previous) {

    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed/1000 < 60 ) {
            return 'Just Now';
        } 
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
        
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}