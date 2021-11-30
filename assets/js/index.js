

// Dirty dirty JQuery
$(document).ready(() => {

    let WIDTH = $(window).width(),
        HEIGHT = $(window).height();

    let map = europeMap();
    let bar = horizontalBar(undefined, size = { "width": WIDTH / 2, "height": 600 });

    d3.select("#firstMap").call(map)
        .style("width", WIDTH / 2 + "px")
        .style("height", HEIGHT + "px");

    d3.select("#firstBarChart").call(bar)
        .style("width", WIDTH / 2 + "px")
        .style("height", HEIGHT + "px");


    var sections = $(".pageDrawing").toArray();


    setSectionHeights();
    $(window).resize(() => {
        WIDTH = $(window).width();
        HEIGHT = $(window).height();
    });

    var scroll = {
        activeSection: 0,
        sectionCount: sections.length - 1,
        isThrottled: false,
        throttleDuration: 1000,
        target: $(sections[0]).position().top
    };

    $(window).scroll((e) => {
        console.log("hi");
        e.preventDefault();
    });


    function downSection() {
        var positionFromTop = $(sections[scroll.activeSection + 1]).position().top;
        $("body, html").animate({ scrollTop: positionFromTop }, 300);
        ++scroll.activeSection;
    }

    function upSection() {
        var positionFromTop = $(sections[scroll.activeSection - 1]).position().top;
        $("body, html").animate({ scrollTop: positionFromTop }, 300);
        --scroll.activeSection;
    }

    $(window).keydown(function(e) {
        if (e.keyCode == 40 && scroll.activeSection != sections.length - 1) {
            downSection();
            l("ARROW DOWN");
        } else if (e.keyCode == 38 && scroll.activeSection != 0) {
            upSection();
            l("ARROW UP");
        }
    });
});

// $(function() {
//     $("a[href*=#]").on("click", function(e) {
//         e.preventDefault();
//         $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top },
//             500,
//             "linear"
//         );
//     });
// });