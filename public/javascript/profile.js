//const { $where } = require("../../schemas/PostSchema");
// $where(document).ready(() => {
//     $.get("/api/posts" , (results) => {
//         outputposts(results , $(".postContainer"));
//         //postContainer = container in home.pug
//     })
// })

//const { ProfilingLevel } = require("mongodb");


// function outputposts(results , container) {
//     container.html("");

//     results.forEach(result => {
//         var html = createposthtml(result);
//         container.append(html);
        
//     });
//     //case for no posts
//     if(results.length == 0) {
//         container.append("<span class='noresults'> No Posts Yet </span>")
//     }
// }

$(document).ready(() => {
    loadposts();
});

function loadposts() {
    $.get("/api/posts" ,{ postedBy: ProfileUserId , isRetweet: false } ,(results) => {
        outputposts(results , $(".postContainer"));
    })
}
