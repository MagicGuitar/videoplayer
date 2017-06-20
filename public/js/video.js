/**
 * Created by HZC on 2017/4/1.
 */
$(document).ready(function () {
    var myVideo = $('#myVideo');
    var videoPercentage; // 进度条控制百分比
    var volumePercentage = 0.5; // 声音默认百分比
    var originalState = []; // 声音静音前的状态
    //------------------视频控制-----------------
    // 暂停/播放
    $('.playAndPause').on('click', function () {// 点击暂停/播放按钮
        if (myVideo[0].paused) { // 暂停状态
            myVideo[0].play(); // 设置为播放状态
            // 切换为暂停图标
            $('.playAndPause i').removeClass('fa-play-circle-o');
            $('.playAndPause i').addClass('fa-pause-circle-o');
        }else { // 播放状态
            myVideo[0].pause(); // 设置为暂停状态
            // 切换为播放图标
            $('.playAndPause i').removeClass('fa-pause-circle-o');
            $('.playAndPause i').addClass('fa-play-circle-o');
        }
        return false;
    });
    // 更新进度条和时间
    myVideo.on('timeupdate', function () {
        let currentPosition = myVideo[0].currentTime;// 获取当前播放时间
        let maxDuration = myVideo[0].duration; // 获取视频总时间
        let minute = parseInt(currentPosition / 60); // 获取分钟数
        let second = (currentPosition.toFixed(0)) % 60; // 获取秒数
        let percentage = (currentPosition / maxDuration) * 100;
        formatTime(minute, second, $('.currentTime'));// 格式化显示时间
        $('.progressNowBar').css('width', (percentage + 0.4668) + '%');
        $('.progressPoint').css('left', percentage + '%');
    });
    // 获取视频的总时间
    myVideo.on('loadedmetadata', function () {
        let allMinute = parseInt((myVideo[0].duration)/ 60);
        let allSecond = ((myVideo[0].duration).toFixed(0)) % 60;
        formatTime(allMinute, allSecond, $('.allTime'));
    });
    // 设置缓冲条
    var updateCache = setInterval(function () {
        let percentage = (myVideo[0].buffered.end(0) / myVideo[0].duration) * 100; // 缓冲条的百分比
        // console.log("a"+percentage);
        $('.cacheBar').css('width', percentage + '%');  // 设置缓冲条
        if (percentage == 100) {
            clearInterval(updateCache);
        }
    },1000);

    // --------控制进度条--------
    // 鼠标控制进度条
    function controlProgressBar() {
        let flag = true;
        // console.log($('.progressPoint').css('left'))
        $('.progressPoint').on('mousedown', function () {
            flag = true;
            let downE = window.event || arguments[0];
            // console.log($('.progressPoint').css('left'))
            $(document).mousemove(function () {
                let moveE = window.event || arguments[0];
                // console.log($('.progressPoint').css('left'))
                if (parseInt($('.progressNowBar').css('width')) < parseInt($('.cacheBar').css('width'))) {
                    // console.log($('.progressNowBar').css('width'));
                    console.log($('.cacheBar').css('width'));
                    if (flag == true) {
                        // console.log(moveE.clientX);
                        let controlFrameWidth = parseInt($('.controlFrame').css('width'));
                        $('.progressPoint').css('left', moveE.clientX - downE.offsetX - (document.documentElement.clientWidth - controlFrameWidth)/2 + 'px');
                        $('.progressNowBar').css('width', moveE.clientX - downE.offsetX - (document.documentElement.clientWidth - controlFrameWidth)/2 + 5 + 'px');
                        progressBoundaryJudgment();
                        videoPercentage = parseInt($('.progressPoint').css('left'))/parseInt($('.progressFrame').css('width'));
                        if (parseInt($('.progressNowBar').css('width')) < parseInt($('.cacheBar').css('width'))) {
                            // console.log(2222);
                            myVideo[0].currentTime =  videoPercentage * myVideo[0].duration;
                        }else {
                            myVideo[0].currentTime = myVideo[0].currentTime;
                        }
                    }
                }
            });
            $(document).mouseup(function () {
                // console.log(1);
                flag = false;
            });
        });
    }
    controlProgressBar(); // 调用控制进度条
    // 键盘控制进度条
    document.onkeydown = function () {
        let e = window.event || arguments[0];
        if (e.keyCode == 37) {// 左
            console.log(1);
            myVideo[0].currentTime -= 5;
        }
        if (e.keyCode == 39) {// 右
            console.log(2);
            if (parseInt($('.progressNowBar').css('width')) < parseInt($('.cacheBar').css('width'))) {
                myVideo[0].currentTime += 5;
            }
        }
    }
    // 窗口改变时，检测控制菜单
    window.onresize = function () {
        progressBoundaryJudgment();
        $('.progressPoint').css('left', parseInt($('.progressFrame').css('width')) * videoPercentage + 'px');
        $('.progressNowBar').css('width', parseInt($('.progressFrame').css('width')) * videoPercentage + 5 + 'px');
        // console.log($('.progressPoint').css('left'));
    }
    // 下一集
    // $('.nextEpisode').on('click', function () {
    //     $('#myVideo').html('');
    //     // console.log($('#myVideo source')[0].style.src = 'media/ONE PUNCH MAN[08].mp4');
    // });
    //------------------音频控制-----------------
    // 有声音/静音
    $('.voice').on('click', function () {
        console.log($('.voiceControlPoint').css('left'));
        if (!myVideo[0].muted || volumePercentage == 0) {// 静音
            // 存储静音前的状态
            originalState[0] = $('.voiceControlPoint').css('left');
            originalState[1] = $('.voiceNowBar').css('width');
            myVideo[0].muted = true;
            // 切换为暂停图标
            $('.voice i').removeClass('fa-volume-up');
            $('.voice i').addClass('fa-volume-off');
            // 设置声音控制条的状态
            $('.voiceControlPoint')[0].style.left = "0%";
            $('.voiceNowBar')[0].style.width = '0%';
        }else { // 有声音
            myVideo[0].muted = false;
            // 切换为播放图标
            $('.voice i').removeClass('fa-volume-off');
            $('.voice i').addClass('fa-volume-up');
            // 还原有声音时的状态
            $('.voiceControlPoint')[0].style.left = originalState[0];
            $('.voiceNowBar')[0].style.width = originalState[1];
        }
    });

    // 鼠标控制声音
    function controlVoiceBar() {
        let flag = true;
        $('.voiceControlPoint').on('mousedown', function () {
            let eDown = window.event || arguments[0];
            flag = true;
            $(document).mousemove(function () {
                let eMove = window.event || arguments[0];
                if (flag == true) {
                    // console.log(document.documentElement.clientWidth);
                    let distanceLeft = document.documentElement.clientWidth * 0.816251;
                    volumePercentage = parseInt($('.voiceNowBar').css('width')) / parseInt($('.voiceControl-frame').css('width'));
                    $('.voiceControlPoint').css('left', eMove.clientX - eDown.offsetX - distanceLeft + 'px');
                    $('.voiceNowBar').css('width', eMove.clientX - eDown.offsetX - distanceLeft + 5 + 'px');
                    console.log(volumePercentage);
                    voiceBoundary(volumePercentage); // 声音边界判断
                    // volumePercentage超出范围[0-1]处理
                    if (volumePercentage < 1) {
                        myVideo[0].volume = volumePercentage;
                    }else {
                        myVideo[0].volume = 1;
                    }
                    if (volumePercentage <= 0) {
                        myVideo[0].muted = true;
                        // 切换为暂停图标
                        $('.voice i').removeClass('fa-volume-up');
                        $('.voice i').addClass('fa-volume-off');
                    }else {
                        myVideo[0].muted = false;
                        // 切换为播放图标
                        $('.voice i').removeClass('fa-volume-off');
                        $('.voice i').addClass('fa-volume-up');
                    }
                }
            });
            $(document).mouseup(function () {
                flag = false;
            });
        });
    }
    controlVoiceBar();
    // 全屏
    $('.fullScreen').on('click', function () {
        if(myVideo[0].requestFullscreen) {
            myVideo[0].requestFullscreen();
        } else if(myVideo[0].mozRequestFullScreen) {
            myVideo[0].mozRequestFullScreen();
        } else if(myVideo[0].webkitRequestFullscreen) {
            myVideo[0].webkitRequestFullscreen();
        } else if(myVideo[0].msRequestFullscreen) {
            myVideo[0].msRequestFullscreen();
        }
    });
    // 视频结束后重置

});

// 格式化显示时间
/**
 *
 * @param {number} minute
 * @param {number} second
 * @param {object} obj
 */
function formatTime(minute, second, obj) {
    if (minute < 10 && second < 10) {
        obj.text('0' + minute + ":0" + second);
    }else if (minute < 10 && second >= 10) {
        obj.text('0'+ minute + ":" + second);
    }else if (minute >= 10 && second < 10) {
        obj.text(minute + ":0" + second);
    }else if (minute >= 10 && second >= 10) {
        obj.text(minute + ":" + second);
    }
}
// 视频控制条边界判断
function progressBoundaryJudgment() {
    // var clientWidth = parseInt(document.documentElement.clientWidth);
    if (parseInt($('.progressPoint')[0].style.left) < 0){//左边界判断
        $('.progressPoint')[0].style.left = "0";
        $('.progressNowBar')[0].style.width = "0";
    }
    else if (parseInt($('.progressPoint')[0].style.left) > parseInt($('.progressFrame').css('width'))){//右边界判断
        $('.progressPoint')[0].style.left = '99%';
        $('.progressNowBar')[0].style.width = '100%';
    }
}

// 声音控制条边界判断
function voiceBoundary(volumePercentage) {
    if (volumePercentage <= 0) {
        $('.voiceControlPoint')[0].style.left = 0;
        // $('.voiceNowBar')[0].style.width = 0;
    }else if (parseInt($('.voiceControlPoint')[0].style.left) > parseInt($('.voiceControl-frame').css('width'))) {
        $('.voiceControlPoint')[0].style.left = $('.voiceControl-frame').css('width');
        $('.voiceNowBar')[0].style.width = $('.voiceControl-frame').css('width');
    }
}

// 视频结束后重置
function videoIsEnd(obj) {
    // if (obj[0].ended == true) {
    //     obj[0].load();
    //     $('.progressPoint')[0].style.left = "0";
    //     $('.progressNowBar')[0].style.width = "0";
    // }
}
