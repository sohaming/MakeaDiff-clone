var video1,
  player1,
  main_video_dash =
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/No_Intervention_new/h264.mpd",
  main_video_hls =
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/No_Intervention_new/h264_master.m3u8",
  video_ele = "myVideo",
  video_load_ele = "myVideo_load",
  video_array_dash = [
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_01_new/h264.mpd",
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_02_opt/h264.mpd",
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_03_opt/h264.mpd",
  ],
  video_array_hls = [
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_01_new/h264_master.m3u8",
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_02_opt/h264_master.m3u8",
    "https://d39uag6u5n989.cloudfront.net/MADWebsite/Intervention_03_opt/h264_master.m3u8",
  ],
  array_start = [61, 132, 276],
  array_end = [100, 151, 300],
  loaderTimeArray = [29, 16, 20],
  intervention_time = [0, 0, 0],
  total_time_video2 = [83, 118, 139],
  total_time_video1 = 325,
  flip_count = 0,
  isFullScreen = !1,
  currentOrientation = window.orientation,
  current = "",
  mainVideo = !0;
const timeInterval = 5;
var isReplay = !1;
function VideoPlayer(e, t, i, r, n, o, a, s, l, d, c, u) {
  "probably" === supportsVideoType("hls")
    ? ((this.main_video = t), (this.array_of_video = o))
    : ((this.main_video = e), (this.array_of_video = n)),
    shaka.Player.isBrowserSupported()
      ? (this.isShakaSupport = !0)
      : (this.isShakaSupport = !1),
    (this.video_id = i),
    (this.video_id_load = r),
    (this.array_start = a),
    (this.array_end = s),
    (this.intervention_time = u),
    (this.index = l),
    (this.video_src = document.getElementById(i)),
    (this.video_src_load = document.getElementById(r)),
    (this.isFlipped = !1),
    (this.flip_time = 0),
    (this.isExperienceStart = !1),
    (this.total_time_video2 = d),
    (this.total_time_video1 = c);
}
function supportsVideoType(e) {
  let t;
  return (
    t || (t = document.createElement("video")),
    t.canPlayType(
      {
        ogg: 'video/ogg; codecs="theora"',
        h264: 'video/mp4; codecs="avc1.42E01E"',
        webm: 'video/webm; codecs="vp8, vorbis"',
        vp9: 'video/webm; codecs="vp9"',
        hls: 'application/x-mpegURL; codecs="avc1.42E01E"',
      }[e] || e
    )
  );
}
function onError(e) {}
function onErrorEvent(e) {
  onError(e.detail);
}
function attachEvents(e) {
  if (
    (parseInt(current.video_src.currentTime) <= current.array_end[0]
      ? (current.index = 0)
      : parseInt(current.video_src.currentTime) > current.array_end[0] &&
        parseInt(current.video_src.currentTime) <= current.array_end[1]
      ? (current.index = 1)
      : parseInt(current.video_src.currentTime) > current.array_end[1] &&
        (current.index = 2),
    current.video_src.currentTime >= 0.2 &&
      0 == current.video_src.paused &&
      $(".video-title").fadeOut(),
    parseInt(current.video_src.currentTime) >=
      current.array_start[current.index] &&
      parseInt(current.video_src.currentTime) <=
        current.array_end[current.index] &&
      ((0 != current.flip_time &&
        current.flip_time < current.array_start[current.index]) ||
        0 == current.flip_time))
  ) {
    if (
      (window.removeEventListener("orientationchange", checkCurrentOrientation),
      window.removeEventListener("orientationchange", flipScreenAction),
      $("#filp-wrap").show(),
      $("#timer").show(),
      $("#timer").addClass("display-timer"),
      $("#timer").hasClass("display-timer"))
    ) {
      var t;
      (t = this.loaderTimeArray[current.index]),
        $("svg circle").css({ "animation-duration": t + "s" });
    }
    window.removeEventListener("orientationchange", checkCurrentOrientation),
      window.addEventListener("orientationchange", flipScreenAction);
  } else $("#filp-wrap").hide();
  parseInt(current.video_src.currentTime) >= current.total_time_video1 - 3 &&
  !isReplay
    ? ($(".filp-wrap-last-video").fadeIn(200),
      current.video_src.isFlipped || $("#replay1").hide())
    : $(".filp-wrap-last-video").hide(),
    parseInt(current.video_src.currentTime) >=
      current.array_end[current.index] &&
      ($("#filp-wrap").hide(),
      $("#timer").hide(),
      $("#timer").removeClass("display-timer"),
      $("#intro-filp-wrap").hide(),
      window.addEventListener("orientationchange", checkCurrentOrientation),
      window.removeEventListener("orientationchange", flipScreenAction),
      (current.index += 1),
      current.index == current.array_end.length && (current.index = 0),
      deviceIsMobile &&
        !iosDevice &&
        screen.orientation.lock("landscape").catch(function () {})),
    current.video_src.ended &&
      (current.video_src.isFlipped || $("#replay").hide(), exitFullScreen());
}
function getReplayTime() {
  var e = parseInt(current.video_src.currentTime),
    t = current.array_start[current.index];
  return e - timeInterval < t ? t : e - timeInterval;
}
function playShakaVideo() {
  current.video_src.pause(),
    $(current.video_src).hide(),
    seekbar_style(!1),
    0 == current.index
      ? $(".video-title#first").show()
      : 1 == current.index
      ? $(".video-title#second").show()
      : 2 == current.index && $(".video-title#third").show(),
    $(current.video_src_load).show(),
    $("#filp-wrap").hide(),
    2 == current.index
      ? (current.flip_time = 0)
      : (current.flip_time = getReplayTime()),
    setTimeout(function () {
      current.video_src_load.play();
    }, 4e3),
    $(".nav-section").removeClass("active"),
    $(".play-button img").attr("src", "images/play.png"),
    $(".play-button").removeClass("active"),
    0 == flip_count && play_pause(current.video_src_load),
    flip_count++,
    deviceIsMobile &&
      !iosDevice &&
      screen.orientation.lock("landscape").catch(function () {}),
    2 == current.index && (current.index = 0);
}
function loadShakaVideo() {
  shaka.Player.isBrowserSupported()
    ? player1
        .load(current.array_of_video[current.index])
        .then(function () {
          current.video_src_load.ontimeupdate = function (e) {
            captureEventToDisplayButtons(e);
          };
        })
        .catch(onError)
    : ((current.video_src_load.src = current.array_of_video[current.index]),
      current.video_src_load.play(),
      console.log("The video has now been loaded!"),
      (current.video_src_load.ontimeupdate = function (e) {
        captureEventToDisplayButtons(e);
      }));
}
function captureEventToDisplayButtons(e) {
  current.video_src_load.currentTime >= 0.5 &&
  0 == current.video_src_load.paused
    ? ($(".video-title").fadeOut(), $("#filp-wrap").hide())
    : $("#filp-wrap").hide(),
    parseInt(current.video_src_load.currentTime) >=
    current.total_time_video2[[current.index]] - 4
      ? $(".filp-wrap-last-video").fadeIn(200)
      : $(".filp-wrap-last-video").hide(),
    current.video_src_load.ended && exitFullScreen();
}
function flipInDesktop() {
  (current.isFlipped = !0),
    analyticData(current.index),
    $(".play-button img").attr("src", "images/pause.png"),
    $(".play-pause img").attr("src", "images/pause.svg"),
    $(".play-button").removeClass("active"),
    loadShakaVideo(),
    playShakaVideo();
}
function flipScreenAction() {
  current.isFlipped
    ? (seekbar_style(!1),
      window.ga &&
        ga.loaded &&
        ga("gtag_UA_5816278_5.send", {
          hitType: "event",
          eventCategory: "Video",
          eventAction: "Flipped",
          eventLabel: "Phone Flipped",
        }),
      0 == window.orientation
        ? (current.video_src_load.pause(),
          current.video_src.pause(),
          $(".video-play-wrap").show())
        : (-1 * currentOrientation == window.orientation &&
            current.video_src_load.paused) ||
          (current.video_src_load.play(),
          $(".video-container-play").show(),
          $(".nav-section").removeClass("active"),
          $(".play-button img").attr("src", "images/play.png"),
          $(".play-button").removeClass("active")))
    : (-1 * currentOrientation == window.orientation
        ? (analyticData(current.index),
          loadShakaVideo(),
          playShakaVideo(),
          (current.isFlipped = !0))
        : currentOrientation == window.orientation &&
          ("" != current &&
            current.video_src.paused &&
            !current.isFlipped &&
            current.video_src.play(),
          current.isFlipped &&
            current.video_src_load.paused &&
            current.video_src_load.play()),
      0 != window.orientation ||
        current.isFlipped ||
        (current.video_src_load.pause(),
        current.video_src.pause(),
        $(".video-play-wrap").show())),
    (currentOrientation = window.orientation);
}
function checkCurrentOrientation() {
  "" != current && 0 == window.orientation
    ? current.video_src.pause()
    : (-1 * currentOrientation == window.orientation &&
        current.video_src.paused) ||
      ("" != current &&
        current.video_src.paused &&
        (current.video_src.play(),
        $(".nav-section").removeClass("active"),
        $(".play-button img").attr("src", "images/play.png"),
        $(".play-button").removeClass("active"))),
    (currentOrientation = window.orientation);
}
function play_pause(e) {
  var t = document.getElementById("seek-bar");
  document.documentElement.addEventListener(
    "keydown",
    function (t) {
      32 == (t.keycode || t.which) &&
        (t.preventDefault(),
        "block" == $(e).css("display") &&
          ($(".video-controls").fadeIn(200),
          e.paused
            ? (e.play(),
              $(".play-button img").attr("src", "images/pause.png"),
              $(".play-pause img").attr("src", "images/pause.svg"),
              setTimeout(function () {
                $(".play-button").removeClass("active"),
                  $(".video-controls").fadeOut(200);
              }, 1500))
            : (e.pause(),
              $(".play-button img").attr("src", "images/play.png"),
              $(".play-pause img").attr("src", "images/play-button.svg"),
              $(".play-button").addClass("active"))));
    },
    !1
  ),
    $("#myVideo, #myVideo_load").on("mouseover", function (e) {
      $(".video-controls").fadeIn(200),
        setTimeout(function () {
          $(".video-controls").fadeOut(500);
        }, 2e3);
    }),
    $(".play-pause, .play-button, #myVideo, #myVideo_load").on(
      "click",
      function (t) {
        "block" == $(e).css("display") &&
          ($(".video-controls").fadeIn(200),
          e.paused
            ? (e.play(),
              $(".play-button img").attr("src", "images/pause.png"),
              $(".play-pause img").attr("src", "images/pause.svg"),
              setTimeout(function () {
                $(".play-button").removeClass("active"),
                  $(".video-controls").fadeOut(200);
              }, 1500))
            : (e.pause(),
              $(".play-button img").attr("src", "images/play.png"),
              $(".play-pause img").attr("src", "images/play-button.svg"),
              $(".play-button").addClass("active")));
      }
    ),
    window.addEventListener("blur", function () {
      e.paused ||
        (e.pause(),
        $(".play-button img").attr("src", "images/play.png"),
        $(".play-pause img").attr("src", "images/play-button.svg"),
        $(".play-button").addClass("active"),
        setTimeout(function () {
          $(".play-button img").attr("src", "images/play.png");
        }, 800));
    }),
    $(".mute-unmute").on("click", function (t) {
      "block" == $(e).css("display") &&
        (e.muted
          ? ((e.muted = !1),
            $(".mute-unmute img").attr("src", "images/mute.svg"))
          : ((e.muted = !0),
            $(".mute-unmute img").attr("src", "images/unmute.svg")));
    }),
    $("#help-info").on("click", function (t) {
      e.pause(),
        $(".play-button img").attr("src", "images/play.png"),
        $(".play-pause img").attr("src", "images/play-button.svg"),
        $(".play-button").addClass("active"),
        $("#help-info").hide(),
        $(".close_button").show(),
        current.isFlipped
          ? 0 == current.index
            ? $(".video-title#first").show()
            : 1 == current.index
            ? $(".video-title#second").show()
            : 2 == current.index && $(".video-title#third").show()
          : $(".video-title#initial").show();
    }),
    $(".close_button").on("click", function () {
      $(".video-title").hide(), $("#close").hide(), $("#help-info").show();
    }),
    e.addEventListener("timeupdate", function () {
      if (!navigator.onLine)
        return (
          alert(
            "You're not connected to the internet. Please check your connection"
          ),
          !1
        );
      var i = e.currentTime < 0 ? "-" : "",
        r = e.duration < 0 ? "-" : "",
        n = Math.floor(Math.abs(e.currentTime / 60)),
        o = Math.floor(Math.abs(e.currentTime) % 60),
        a = i + (n < 10 ? "0" : "") + n + ":" + (o < 10 ? "0" : "") + o,
        s = Math.floor(Math.abs(e.duration / 60)),
        l = Math.floor(Math.abs(e.duration) % 60),
        d = r + (s < 10 ? "0" : "") + s + ":" + (l < 10 ? "0" : "") + l;
      $("#video-current-time").val(a), $("#video-duration").val(d);
      var c = (100 / e.duration) * e.currentTime;
      t.value = c;
    }),
    t.addEventListener("input", function () {
      if ("block" == $(e).css("display")) {
        e.pause();
        var i = e.duration * (t.value / 100);
        (e.currentTime = i), e.play();
      }
    }),
    t.addEventListener("mousedown", function () {
      "block" == $(e).css("display") && e.pause();
    }),
    t.addEventListener("mouseup", function () {
      "block" == $(e).css("display") &&
        (e.play(),
        $(".play-button img").attr("src", "images/pause.png"),
        $(".play-pause img").attr("src", "images/pause.svg"));
    }),
    t.addEventListener("touchstart", function () {
      "block" == $(e).css("display") && e.pause();
    }),
    t.addEventListener("touchend", function () {
      "block" == $(e).css("display") &&
        (e.play(),
        $(".play-button img").attr("src", "images/pause.png"),
        $(".play-pause img").attr("src", "images/pause.svg"));
    });
}
function analyticData(e) {
  switch (e) {
    case 0:
      (analytics.interval0.visited = !0),
        (analytics.interval0.timestamp = new Date());
      break;
    case 1:
      (analytics.interval1.visited = !0),
        (analytics.interval1.timestamp = new Date());
      break;
    case 2:
      (analytics.interval2.visited = !0),
        (analytics.interval2.timestamp = new Date());
  }
}
function seekbar_style(e) {
  document.getElementById("pause_video"), document.getElementById("mute");
  var t = document.getElementById("seek-bar");
  if (e) {
    var i =
      "linear-gradient(left, #FAFAFAB3 0%, #FAFAFAB3 " +
      (array_start[0] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      (array_start[0] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      ((array_start[0] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      ((array_start[0] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      (array_start[1] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      (array_start[1] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      ((array_start[1] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      ((array_start[1] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      (array_start[2] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      (array_start[2] / total_time_video1) * 100 +
      "%, #ED1849B3 " +
      ((array_start[2] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      ((array_start[2] + 2) / total_time_video1) * 100 +
      "%, #FAFAFAB3 " +
      (total_time_video1 / total_time_video1) * 100 +
      "%)";
    t.style.backgroundImage =
      (function () {
        for (
          var e = "",
            t = ["-o-", "-ms-", "-moz-", "-webkit-"],
            i = document.createElement("div"),
            r = 0;
          r < t.length;
          r++
        )
          (i.style.background = t[r] + "linear-gradient(#000000, #ffffff)"),
            i.style.background && (e = t[r]);
        return (i = null), delete i, e;
      })() + i;
  } else {
    i = "#FFFFFFB3";
    t.style.background = i;
  }
}
function reset_controls() {
  $(".play-button img").attr("src", "images/pause.png"),
    $(".mute-unmute img").attr("src", "images/mute.svg"),
    $(".play-pause img").attr("src", "images/pause.svg"),
    $(".play-button").removeClass("active");
}
(analytics = {
  interval0: { visited: !1, timestamp: null },
  interval1: { visited: !1, timestamp: null },
  interval2: { visited: !1, timestamp: null },
}),
  (VideoPlayer.prototype.loadVideo = function () {
    if (
      (shaka.polyfill.installAll(),
      (current = this),
      shaka.Player.isBrowserSupported())
    ) {
      var e = this.video_src;
      video1 = this.video_src_load;
      var t = new shaka.Player(e);
      (player1 = new shaka.Player(video1)),
        (window.player = t),
        t.addEventListener("error", onErrorEvent),
        player1.addEventListener("error", onErrorEvent),
        t.configure({ streaming: { bufferingGoal: 2e3 } }),
        player1.configure({ streaming: { bufferingGoal: 2e3 } }),
        t
          .load(this.main_video)
          .then(function () {
            current.video_src.ontimeupdate = function (e) {
              attachEvents(e);
            };
          })
          .catch(onError);
    } else
      (this.video_src.src = this.main_video),
        (this.video_src.currentTime = 0),
        (this.video_src.ontimeupdate = function (e) {
          attachEvents(e);
        });
    console.log("Video Loaded");
  }),
  (VideoPlayer.prototype.playVideo = function () {
    window.addEventListener("orientationchange", checkCurrentOrientation),
      (this.isExperienceStart = !0),
      console.log("Video Loaded and Ready to Play"),
      window.ga &&
        ga.loaded &&
        ga("gtag_UA_5816278_5.send", {
          hitType: "event",
          eventCategory: "Video",
          eventAction: "clicked",
          eventLabel: "Play Button was clicked",
        }),
      play_pause(current.video_src),
      "Safari" == browserName || iosDevice
        ? (current.video_src.pause(),
          window.setTimeout(function () {
            current.video_src.play();
          }, 3e3))
        : (window.ga &&
            ga.loaded &&
            ga("gtag_UA_5816278_5.send", {
              hitType: "event",
              eventCategory: "Video",
              eventAction: "play",
              eventLabel: "Video started playing",
            }),
          current.video_src.play());
  }),
  (VideoPlayer.prototype.replayVideo = function () {
    window.addEventListener("orientationchange", checkCurrentOrientation),
      (isReplay = !0),
      (current.isFlipped = !1),
      (this.video_src.currentTime = this.flip_time),
      this.video_src_load.pause(),
      $(this.video_src_load).hide(),
      $(".filp-wrap-last-video").hide(),
      $(this.video_src).show(),
      this.video_src.play();
  }),
  (VideoPlayer.prototype.restartVideo = function () {
    window.addEventListener("orientationchange", checkCurrentOrientation),
      (isReplay = !1),
      (current.isFlipped = !1),
      (this.video_src.currentTime = 0),
      this.video_src_load.pause(),
      $(this.video_src_load).hide(),
      $(".filp-wrap-last-video").hide(),
      $(this.video_src).show(),
      this.video_src.play();
  });
var video_player = new VideoPlayer(
    main_video_dash,
    main_video_hls,
    video_ele,
    video_load_ele,
    video_array_dash,
    video_array_hls,
    array_start,
    array_end,
    0,
    total_time_video2,
    total_time_video1,
    intervention_time
  ),
  isSamsungBrowser = navigator.userAgent.match(/SamsungBrowser/i);
function startVideo() {
  $(".video-controls").show(),
    $(".video-play-wrap, #init-trigger").fadeOut(500),
    $(".video-container-play, .fullscreen-mode").fadeIn(500),
    video_player.playVideo(),
    setTimeout(function () {
      $("#resume-trigger").fadeIn(500);
    }, 1e3);
}
function myHandler(e) {
  window.removeEventListener("orientationchange", flipScreenAction),
    window.removeEventListener("orientationchange", checkCurrentOrientation),
    $(
      ".video-container-play, .video-play-wrap, #init-trigger, #resume-trigger, .rotate-info-sec"
    ).fadeOut(),
    $(".after-video, .video-play-wrap").fadeIn(),
    (video_player.isExperienceStart = !1);
}
null != isSamsungBrowser &&
  isSamsungBrowser[0] &&
  ($(".upgrade-browser-sam").show(),
  $(".video-play-cont,.upgrade-browser").hide()),
  $(".video-play-wrap #init-trigger").on("click", function () {
    video_player.loadVideo(),
      navigator.onLine ||
        alert(
          "You're not connected to the internet. Please check your connection"
        ),
      $(".video-title#initial").show(),
      enterFullscreen(),
      seekbar_style(!0),
      $("#help-info").show(),
      "Safari" == browserName || iosDevice
        ? startVideo()
        : window.setTimeout(startVideo, 3e3);
  }),
  $(".video-play-wrap #restart-trigger").on("click", function () {
    if (!navigator.onLine)
      return (
        alert(
          "You're not connected to the internet. Please check your connection"
        ),
        !1
      );
    $(".slider").load(location.href + ".slider"),
      $(".video-play-wrap, #init-trigger").fadeOut(500),
      $(".video-container-play, .fullscreen-mode").fadeIn(500),
      $("#myVideo").attr("src", main_video_dash),
      seekbar_style(!0),
      $("#help-info").show(),
      reset_controls(),
      setTimeout(function () {
        $("#resume-trigger").fadeIn(500);
      }, 1e3),
      video_player.playVideo(),
      enterFullscreen();
  }),
  $(".video-play-wrap #resume-trigger").on("click", function () {
    if (!navigator.onLine)
      return (
        alert(
          "You're not connected to the internet. Please check your connection"
        ),
        !1
      );
    $("html, body").animate({ scrollTop: 0 }),
      seekbar_style(!0),
      $("#help-info").show(),
      reset_controls(),
      $(".play-button img").attr("src", "images/play.png"),
      $(".play-button").removeClass("active"),
      enterFullscreen(),
      current.isFlipped
        ? current.video_src_load.play()
        : current.video_src.play();
  }),
  $("#desktop-flip").on("click", function () {
    seekbar_style(!1),
      flipInDesktop(),
      $("#intro-filp-wrap").show(),
      setTimeout(function () {
        $("#intro-filp-wrap").hide();
      }, 2e3);
  }),
  $(window).on("orientationchange", function (e) {
    "portrait" == e.orientation && video_player.isExperienceStart
      ? ($(".video-container-play").hide(),
        $(".video-play-wrap").show(),
        $("body").css("overflow", "hidden"))
      : "landscape" == e.orientation &&
        video_player.isExperienceStart &&
        ($(".video-container-play").show(),
        $(".video-play-wrap").hide(),
        $("body").css("overflow", "scroll"));
  }),
  $("body").removeClass("body-hidden"),
  $(".ios-fullscreen-mode").on("click", function () {
    $("body").removeClass("limited"),
      $("html").removeClass("limited"),
      $(".video-container-play.iosRotate").hide(),
      $(".video-play-wrap").show(),
      $("body").unbind("touchmove"),
      $("header.header").show(),
      current.isFlipped
        ? current.video_src_load.pause()
        : current.video_src.pause();
  }),
  document.getElementById(video_ele).addEventListener("ended", myHandler, !1),
  document
    .getElementById(video_load_ele)
    .addEventListener("ended", myHandler, !1),
  $("#replay, #replay1").on("click", function () {
    video_player.replayVideo(),
      $(".after-video").fadeOut(),
      $(".filp-wrap-last-video").hide(),
      seekbar_style(!0),
      reset_controls(),
      $(".slider").fadeIn(),
      $(".video-container-play, .video-play-wrap, #resume-trigger").fadeIn(),
      (video_player.isExperienceStart = !0),
      enterFullscreen();
  }),
  $("#restart-trigger1").on("click", function () {
    video_player.restartVideo(),
      seekbar_style(!0),
      reset_controls(),
      $(".filp-wrap-last-video").hide(),
      $(".after-video").fadeIn(),
      (video_player.isExperienceStart = !1),
      enterFullscreen();
  }),
  $("#restart-trigger-after-video").on("click", function () {
    video_player.restartVideo(),
      seekbar_style(!0),
      reset_controls(),
      $(".after-video").fadeOut(),
      $(".filp-wrap-last-video").hide(),
      $(".slider").fadeIn(),
      $(".video-container-play, .video-play-wrap, #resume-trigger").fadeIn(),
      (video_player.isExperienceStart = !1),
      enterFullscreen();
  }),
  $("#enter_fullscreen").on("click", function () {
    enterFullscreen();
  }),
  $("#exit_fullscreen").on("click", function () {
    exitFullScreen();
  });
var lockFs = document.getElementById("init-trigger");
function goFullScreen() {
  document.fullscreenElement ||
  document.mozFullScreenElement ||
  document.webkitFullscreenElement ||
  document.msFullscreenElement
    ? exitFullscreen()
    : screenLockFullscreen(document.getElementById("desktop-view"));
}
function screenLockFullscreen(e) {
  $("#enter_fullscreen").hide(),
    $("#exit_fullscreen").show(),
    e.requestFullscreen
      ? e.requestFullscreen()
      : e.mozRequestFullScreen
      ? e.mozRequestFullScreen()
      : e.webkitRequestFullscreen
      ? e.webkitRequestFullscreen()
      : e.msRequestFullscreen && e.msRequestFullscreen(),
    deviceIsMobile && !iosDevice && screen.orientation.lock("landscape");
}
function enterFullscreen() {
  (isFullScreen = !0),
    $("#enter_fullscreen").hide(),
    $("#exit_fullscreen").show();
  var e =
      (document.fullscreenElement && null !== document.fullscreenElement) ||
      (document.webkitFullscreenElement &&
        null !== document.webkitFullscreenElement) ||
      (document.mozFullScreenElement &&
        null !== document.mozFullScreenElement) ||
      (document.msFullscreenElement && null !== document.msFullscreenElement),
    t = document.documentElement;
  if (!e) {
    t.requestFullscreen
      ? t.requestFullscreen()
      : t.mozRequestFullScreen
      ? t.mozRequestFullScreen()
      : t.webkitRequestFullScreen
      ? t.webkitRequestFullScreen()
      : t.msRequestFullscreen && t.msRequestFullscreen();
    var i = 0;
    firefoxBrowser && (i = 200),
      setTimeout(function () {
        if (deviceIsMobile && !iosDevice) {
          screen.orientation
            .lock("landscape")
            .then(function () {
              currentOrientation = window.orientation;
            })
            .catch(function () {
              screen.mozLockOrientation("landscape");
            });
        }
      }, i);
  }
  $(".video-container-play").show(),
    $(".video-play-wrap").hide(),
    $("html, body").animate({ scrollTop: 0 }, "fast"),
    $("body").css("overflow", "hidden"),
    $("header.header").hide(),
    iosDevice &&
      ($("body").addClass("limited"),
      $("html").addClass("limited"),
      iosCssPortrait(),
      $("header.header").hide(),
      $(".video-container-play.iosRotate").show(),
      current.isFlipped
        ? current.video_src_load.play()
        : current.video_src.play()),
    setTimeout(function () {
      currentOrientation = window.orientation;
    }, 1e3);
}
function exitFullScreen() {
  (isFullScreen = !1),
    $("body").css("overflow", "scroll"),
    current.isFlipped
      ? current.video_src_load.pause()
      : current.video_src.pause();
  var e =
    (document.fullscreenElement && null !== document.fullscreenElement) ||
    (document.webkitFullscreenElement &&
      null !== document.webkitFullscreenElement) ||
    (document.mozFullScreenElement && null !== document.mozFullScreenElement) ||
    (document.msFullscreenElement && null !== document.msFullscreenElement);
  document.documentElement;
  e &&
    (document.exitFullscreen
      ? document.exitFullscreen()
      : document.webkitExitFullscreen
      ? document.webkitExitFullscreen()
      : document.mozCancelFullScreen
      ? document.mozCancelFullScreen()
      : document.msExitFullscreen && document.msExitFullscreen()),
    deviceIsMobile &&
      ($("#enter_fullscreen").show(),
      $("#exit_fullscreen").hide(),
      $(".video-container-play").hide(),
      $(".video-play-wrap").show()),
    $("header.header").show();
}
function exitHandler() {
  document.fullscreenElement ||
    document.webkitIsFullScreen ||
    document.mozFullScreen ||
    document.msFullscreenElement ||
    ($("#enter_fullscreen").show(),
    $("#exit_fullscreen").hide(),
    $(".on-load").hide(),
    $(".on-intervention").hide(),
    $(".on-resume").hide(),
    current.isFlipped ? $(".on-intervention").show() : $(".on-resume").show(),
    exitFullScreen());
}
document.addEventListener("fullscreenchange", exitHandler),
  document.addEventListener("webkitfullscreenchange", exitHandler),
  document.addEventListener("mozfullscreenchange", exitHandler),
  document.addEventListener("MSFullscreenChange", exitHandler);
var isWebView = !1;
function isSocialMediaBrowser() {
  var e = navigator.userAgent || navigator.vendor || window.opera;
  return (
    e.indexOf("FBAN") > -1 ||
    e.indexOf("FBAV") > -1 ||
    e.indexOf("Instagram") > -1
  );
}
isWebView = isSocialMediaBrowser();
var deviceIsMobile = !1,
  iosDevice = !1,
  iosAutoRotate = !1,
  firefoxBrowser = !1;
function iosCssPortrait() {
  (width_rotate = $(window).width()),
    (height_rotate = $(window).height()),
    (translate_rotate = (height_rotate - width_rotate) / 2),
    $(".video-container-play").addClass("iosRotate"),
    $(".video-title").addClass("iosRotate"),
    $(window).width() < $(window).height()
      ? $(".iosRotate").css({
          width: height_rotate + "px",
          height: width_rotate + "px",
          transform:
            "rotate(90deg) translate(" +
            translate_rotate +
            "px," +
            translate_rotate +
            "px)",
        })
      : $(".iosRotate").css({
          width: width_rotate + "px",
          height: height_rotate + "px",
        });
}
(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(
  navigator.userAgent
) ||
  /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
    navigator.userAgent.substr(0, 4)
  )) &&
  (deviceIsMobile = !0),
  /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream &&
    (iosDevice = !0),
  isWebView && (iosDevice = !0),
  "undefined" != typeof InstallTrigger && (firefoxBrowser = !0),
  deviceIsMobile
    ? iosDevice || firefoxBrowser
      ? !iosDevice && firefoxBrowser
        ? ($(".rotate-info-sec, .play-button, #resume-trigger").addClass(
            "mobile"
          ),
          $(".desktop-help").addClass("showinfo"),
          $(".mobile-shaka-help").addClass("hideinfo"),
          $(".video-title").css({ top: "0px" }))
        : ($(".rotate-info-sec, .play-button, #resume-trigger").addClass(
            "mobile"
          ),
          $(".desktop-help").addClass("showinfo"),
          $(".mobile-shaka-help").addClass("hideinfo"))
      : ($(".filp-mobile-wrap, .flip-desktop-wrap").addClass("mobile"),
        $(".mobile-shaka-help").addClass("showinfo"),
        $(".desktop-help").addClass("hideinfo"),
        $(".video-title").css({ top: "0px" }))
    : ($(".desktop-help").addClass("showinfo"),
      $(".mobile-shaka-help").addClass("hideinfo")),
  iosDevice &&
    ($(".fullscreen-mode, .ios-fullscreen-mode").addClass(
      "ios-fullscreen-exit"
    ),
    iosCssPortrait(),
    $(window).on("orientationchange", function (e) {
      $(".filp-mobile-wrap, .flip-desktop-wrap").addClass("mobile"),
        (iosAutoRotate = !0),
        "portrait" == e.orientation
          ? iosCssPortrait()
          : $(".iosRotate").css({
              width: $(window).width() + "px",
              height: $(window).height() + "px",
              transform: "none",
            });
    }));
var bName = (navigator.sayswho = (function () {
    var e,
      t = navigator.userAgent,
      i =
        t.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    return /trident/i.test(i[1])
      ? "IE " + ((e = /\brv[ :]+(\d+)/g.exec(t) || [])[1] || "")
      : "Chrome" === i[1] && null != (e = t.match(/\b(OPR|Edge)\/(\d+)/))
      ? e.slice(1).join(" ").replace("OPR", "Opera")
      : ((i = i[2]
          ? [i[1], i[2]]
          : [navigator.appName, navigator.appVersion, "-?"]),
        null != (e = t.match(/version\/(\d+)/i)) && i.splice(1, 1, e[1]),
        i.join(" "));
  })()),
  browserNumber = bName.match(/\d+/g),
  browserName = bName.match(/[a-zA-Z]+/g);
(("Chrome" == browserName && browserNumber <= "62") ||
  ("Edge" == browserName && browserNumber <= "15") ||
  ("IE" == browserName && browserNumber <= "11") ||
  ("Firefox" == browserName && browserNumber <= "58") ||
  ("Safari" == browserName && browserNumber <= "10")) &&
  ($(".upgrade-browser").show(), $(".video-play-cont").hide());
var getParams = function (e) {
  var t = {},
    i = document.createElement("a");
  i.href = e;
  for (var r = i.search.substring(1).split("&"), n = 0; n < r.length; n++) {
    var o = r[n].split("=");
    t[o[0]] = decodeURIComponent(o[1]);
  }
  return t;
};
(isAutoPlay = !1),
  (parameter = getParams(window.location.href)),
  "on" == parameter.autoplay &&
    ((isAutoPlay = !0),
    video_player.loadVideo(),
    navigator.onLine ||
      alert(
        "You're not connected to the internet. Please check your connection"
      ),
    $(".video-title#initial").show(),
    enterFullscreen(),
    seekbar_style(!0),
    $("#help-info").show(),
    "Safari" == browserName || iosDevice
      ? startVideo()
      : window.setTimeout(startVideo, 8e3));
