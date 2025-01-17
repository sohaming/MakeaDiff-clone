! function(t) {
    if (t(document).ready(function() {
            "use strict";
            t(".bg-image").each(function(e) {
                t(this).attr("data-background") && t(this).css("background-image", "url(" + t(this).data("background") + ")")
            }), t(".bg-color").each(function(e) {
                t(this).attr("data-background") && t(this).css("background-color", t(this).data("background"))
            }), t(document).scroll(function() {
                t(this).scrollTop() > 100 ? t("#scroll-down").fadeOut() : t("#scroll-down").fadeIn()
            }), t("#scroll-down").click(function() {
                t("html, body").animate({
                    scrollTop: t(".care-collective").offset().top - 60
                }, 500, "linear")
            }), t(".number-counter").each(function() {
                t(this).prop("Counter", 0).animate({
                    Counter: t(this).text()
                }, {
                    duration: 3e3,
                    easing: "swing",
                    step: function(e) {
                        t(this).text(Math.ceil(e))
                    }
                })
            }), t(".hamburger-navigation li a").on("click", function(t) {}), t(".hamburger-navigation li a").click(function(t) {
                t.preventDefault();
                var e = this.getAttribute("href");
                setTimeout(function() {
                    window.location = e
                }, 1e3)
            }), t(".team-img-slider").slick({
                slidesToShow: 3,
                slidesToScroll: 1,
                arrows: !0,
                responsive: [{
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2
                    }
                }, {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }]
            })
        }), document.getElementById("counter")) {
        var e = !1;
        t(document).scroll(function() {
            var o = t("#counter").position().top;
            t(document).scrollTop() > o - 300 ? (e || t("#1").html("21"), t("#2").html("37"), t("#3").html("78"), e = !0) : e = !1
        })
    }
    t("#join_community").on("click", function() {
        t(".cover").fadeIn(200), t(".lightbox").fadeIn(200), t("#contain").show(), t("#thankyou-message").hide()
    }), t("#cancel, #close-button, .cover").on("click", function() {
        t(".cover").fadeOut(200), t(".lightbox").fadeOut(200)
    });
    t("#care-counter").html("50,000+");

    t("#save-button").click(function() {
        t.ajax({
            method: "POST",
            url: "https://makeadiff.in/api/v1/contacts",
            data: {
                email: t("#care-collective-email").val(),
                is_care_collective: "1"
            },
            beforeSend: function(t) {
                t.setRequestHeader("Authorization", "Basic " + btoa("sulu.simulation@makeadiff.in:pass"))
            },
            success: function(e) {
                if ("fail" == e.status || "error" == e.status) return console.error(e.data), !1;
                t("#contain").hide(), t("#thankyou-message").show(), t("#error-message").hide(), console.log(e.data)
            }
        }), t.ajax({
            method: "POST",
            contentType: "application/x-www-form-urlencoded",
            url: "https://forms.hubspot.com/uploads/form/v2/5514566/b3052905-df01-4eb8-89c3-8adcc57aa748?hapikey=5514566/b3052905-df01-4eb8-89c3-8adcc57aa748",
            data: {
                email: t("#care-collective-email").val()
            },
            success: function(e) {
                if ("fail" == e.status || "error" == e.status) return console.error(e.data), !1;
                t("#contain").hide(), t("#thankyou-message").show(), setTimeout(function() {}, 2e3), console.log(e.data)
            }
        })
    }), t("#subscribe-newsletter").click(function() {
        t.ajax({
            method: "POST",
            url: "https://makeadiff.in/api/v1/contacts",
            data: {
                email: t("#care-collective-email").val(),
                is_subscribed: "1"
            },
            beforeSend: function(t) {
                t.setRequestHeader("Authorization", "Basic " + btoa("sulu.simulation@makeadiff.in:pass"))
            },
            success: function(e) {
                if ("fail" == e.status || "error" == e.status) return console.error(e.data), !1;
                t(".lighbox #contain").html("Thank You for Signing Up"), setTimeout(function() {
                    t(".cover").fadeOut(200), t(".lightbox").fadeOut(200)
                }, 2e3), console.log(e.data)
            }
        })
    })
}(jQuery), jQuery(document).ready(function(t) {});