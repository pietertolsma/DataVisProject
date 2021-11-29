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

});

function l(o) {
    console.log(o);
}
// Dirty dirty JQuery
$(document).ready(function() {
    var sections = $(".pageDrawing").toArray();

    var scroll = {
        activeSection: 0,
        sectionCount: sections.length - 1,
        isThrottled: false,
        throttleDuration: 1000,
        target: $(sections[0]).position().top
    };

    function setSizes() {
        for (var i = 0; i < sections.length; i++) {
            $(sections[i]).css({
                top: window.innerHeight * i,
                height: window.innerHeight,
                width: window.innerWidth
            });
        }
    }

    setSizes();
    $("body").on("resize", setSizes());

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

    $("body")
        .hammer({ preventDefault: true })
        .on("swipe", function(event) {
            if (event.gesture.direction == "up") {
                if (scroll.activeSection != sections.length - 1) {
                    downSection();
                    l("SWIPED UP");
                }
            } else if (event.gesture.direction == "down") {
                if (scroll.activeSection != 0) {
                    upSection();
                    l("SWIPED DOWN");
                }
            }
        });

    $(window).on("scroll", function(e) {
        e.preventDefault();
    });

    $(window).on("mousewheel", function(event) {
        event.preventDefault();

        if (scroll.isThrottled) {
            return;
        }
        scroll.isThrottled = true;

        setTimeout(function() {
            scroll.isThrottled = false;
        }, scroll.throttleDuration);

        if (event.originalEvent.wheelDelta > 0) {
            if (scroll.activeSection === 0) return false;
            upSection();
            l("WHEELED DOWN");
        } else {
            if (scroll.activeSection >= scroll.sectionCount) return false;
            downSection();
            l("WHEELED UP");
        }
    });

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

$(function() {
    $("a[href*=#]").on("click", function(e) {
        e.preventDefault();
        $("html, body").animate({ scrollTop: $($(this).attr("href")).offset().top },
            500,
            "linear"
        );
    });
});