    var tag = document.createElement('script');

    tag.src = "http://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    var player;

    var videos = {
        'sex in the city': 'a6738DN4I3s',
        'game of thrones': 'y0OqdTUf4sc',
        'american psycho': 'qQx_AN02XuM',
        'top gear': 'FssQhpAqv1I',
        'top gear 2': 'DrUVMdkb4_k',
        'football': 'NurlfAcY378',
        'forrest gump': 'wvJ4wh1kwR8',
        'the prestige': 'ijXruSzfGEc',
        'star wars': 'tUW7EDJmWUA',
        'fifty': 'SfZWFDs0LxA',
        'gopro': 'wTcNtgA6gHs',
        'national': 'cr-er44rr2M',
        'bond': 'BsBd9tPK4uE',
        'mission': 'TTrUyOvsHeM',
        'wing': 'o6mPnvrBYrE',
    }

    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: window.innerHeight,
            width: window.innerWidth,
            videoId: videos['national'],
            startSeconds: 8,
            suggestedQuality: 'highres',


            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange

            }
        });

    }

    function updateVideo(people) {
        if (mapEmotions=='happiness') {
            changeVideo('gopro');
        }
        

    }

    var justSwitched = false

    function changeVideo(i) {
        console.log("change", i)
        var next = videos[i]
        var current = player.getVideoData()['video_id'];
        if (next != current) {
            justSwitched = true
            player.loadVideoById({
                videoId: next,
                startSeconds: 8,
                suggestedQuality: 'highres',
                iv_load_policy: 3
            })
        }
    }



    function onPlayerReady(event) {
        event.target.playVideo();
    }


    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            // setTimeout(stopVideo, 6000);
            done = true;
        }
    }

    function stopVideo() {
        player.stopVideo();
    }
