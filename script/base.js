/**
 * @author: aixiaoyaowudi@gmail.com
 */
window.xiaoyaowudi_default_config = {
    content_class_name : 'post',
    code : {
        font_family : "Consolas,monaco,monospace",
        font_size : "14px",
        highlightjs_theme : 'monokai-sublime',
        max_height : false,
        highlightjs_version : '11.3.1'
    },
    github_username : 'aixiaoyaowudi',
    github_repository : 'wp_files',
    github_version : 'main',
    mathjax_version : '3.2.0',
    require_verion : '2.3.6',
    clipboard_version : '2.0.6',
    mCustomScrollbar_version : '3.1.5',
    language_prefix : 'language'
}
window.xiaoyaowudi_config = $.extend(true, window.xiaoyaowudi_default_config, window.xiaoyaowudi_config);


function Tools() {
    const tools = this;
    this.dynamic_load_css = function (path) {
        if (!path || path.length === 0) {throw new Error('argument "path" is required!');}
        let head = document.getElementsByTagName('head')[0], link = document.createElement('link');
        link.href = path;
        link.rel = 'stylesheet';
        link.type = 'text/css';
        head.appendChild(link);
    };
    this.add_script = function (url) {
        let script = document.createElement('script');
        script.src = url;
        script.async = true;
        document.head.appendChild(script);
    };
    this.get_file = function (filename) {
        return 'https://cdn.jsdelivr.net/gh/' + window.xiaoyaowudi_config.github_username +
               '/' + window.xiaoyaowudi_config.github_repository + '@' + window.xiaoyaowudi_config.github_version + '/' + filename;
    };
    this.random_string = function(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678', maxPos = $chars.length, pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    };
}

const tools = new Tools;

window.MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']]
    },
    svg: {
        fontCache: 'global'
    }
};

function main() {
    this.coding = function () {
        let pre_list = $('.' + window.xiaoyaowudi_config.content_class_name + ' pre');
        (() => {
            $.each(pre_list, function (i) {
                let pre = $(pre_list[i]);
                let box_id = 'code-' + tools.random_string(6);

                pre.wrap('<code-box id="' + box_id + '"></code-box>');
                pre.attr('boxid', box_id);
    
                let pre_code = pre.find('code');
                if (pre_code.length > 0) {
                    let code_class = pre_code.attr('class');
                    if (code_class) {
                        let reg = new RegExp('.*' + window.xiaoyaowudi_config.language_prefix + '-[a-z0-9]+.*');
                        // console.log(reg);
                        // console.log(code_class);
                        let lan = code_class.match(reg);
                        // console.log(lan);
                        if (!!lan && lan.length > 0) {
                            pre.addClass(lan[0]);
                        }
                    }
                }
            });
        })();

        (() => {
            pre_list.css('border-radius', '4px');
            if(window.xiaoyaowudi_config.code.max_height){
                $('code-box pre').css('max-height', window.xiaoyaowudi_config.code.max_height);
            }
            $('code-box pre').css('font-size', window.xiaoyaowudi_config.code.font_size);
            $('code-box pre').css('font-family', window.xiaoyaowudi_config.code.font_family)
        })();

        require(['clipboard', 'highlightjs', 'mCustomScrollbar'], function() {

            let code_box = $('code-box');
            $.each(code_box, function (i) {
                let code  = $(code_box[i]);
                let box_id = code.attr('id');
    
                let copy_html = '<button boxid="' + box_id + '" type="button" class="clipboard code-copay-btn" data-clipboard-action="copy" data-clipboard-target="#' + box_id + ' pre" aria-label="复制代码" ><i class="iconfont icon-fuzhi1"></i></button>';
                code.prepend(copy_html);
            });
    
            $('code-box .code-copay-btn').click(function () {
                $(this).find('i').removeClass('icon-fuzhi1').addClass('icon-right');
                setTimeout("$('code-box button[boxid="+$(this).attr('boxid')+"] i').removeClass('icon-right').addClass('icon-fuzhi1')", 1500);
            });
    
            code_box.on({
                mouseover : function () {
                    $(this).find('.code-copay-btn').css({
                        opacity: 1,
                        visibility: 'visible'
                    });
                },
                mouseout : function () {
                    $(this).find('.code-copay-btn').css({
                        opacity: 0,
                        visibility: 'hidden'
                    });
                }
            });
    
            new ClipboardJS('.clipboard');

            let code  = $('code-box pre');
            let bg_flg = $.inArray(window.xiaoyaowudi_config.code.highlightjs_theme, [
                'github-gist', 'googlecode', 'grayscale',
                'idea', 'isbl-editor-light', 'qtcreator_light',
                'tomorrow', 'vs', 'xcode', 'arduino-light',
                'ascetic', 'color-brewer', 'lightfair'
            ]) !== -1;

            $.each(code, function (i, e) {
                let obj = $(code[i]);

                obj.html().replace(/\<br\>/g, '\n');

                obj.text(obj.text());

                bg_flg && obj.css('background', '#f5f5fa');

                hljs.highlightElement(e);

                $('.clipboard[boxid='+ obj.attr('boxid') +']').addClass('hljs-comment');
            });

            $('code-box pre').mCustomScrollbar({
                theme:"minimal-dark",
                axis:"yx"
            });
            $('.mCSB_dragger_bar').css('background-color', $('.hljs-comment').css('color'));

            let pre_list = $('code-box pre div.mCSB_container');

            $.each(pre_list, function (i) {
                let pre = $(pre_list[i]);
                let code_line = pre.html().replace(/\<br\>/g, '\n').split('\n');
                let code = [];

                $.each(code_line, (j) => {
                    if ($.trim(code_line[j]) || j < code_line.length - 1) {
                        code_line[j] !== '</code>' && code.push('<code-line class="line-numbers-rows"></code-line>' + code_line[j]);
                    }
                });

                pre.html('<code-pre class=\'code-pre code-pre-line\'>' + code.join('\n') + '</code-pre>');
                // pre.addClass('code-pre-line');
            });
        });
    };
    this.math = function() {
        require(['MathJax'], function() {
            MathJax.typeset();
        });
    }
    this.main = function() {
        this.coding();
        this.math();
    }
}

const Main = new main;
require.config({
    map: {
        '*': {
            'css': tools.get_file('lib/css/css.min.js')
        }
    },
    paths: {
        // highlightjs : tools.get_file('lib/highlightjs/' + window.xiaoyaowudi_config.code.highlightjs_version + '/highlight.min'),
        highlightjs : 'https://cdn.bootcdn.net/ajax/libs/highlight.js/' + window.xiaoyaowudi_config.code.highlightjs_version + '/highlight.min',
        clipboard : tools.get_file('lib/clipboard/' + window.xiaoyaowudi_config.clipboard_version + '/clipboard.min'),
        // clipboard : 'https://cdn.bootcdn.net/ajax/libs/clipboard.js/' + window.xiaoyaowudi_config.clipboard_version + '/clipboard.min',
        mCustomScrollbar: tools.get_file('lib/mCustomScrollbar/' +
                                         window.xiaoyaowudi_config.mCustomScrollbar_version +
                                         '/jquery.mCustomScrollbar.min'),
        // MathJax : 'https://cdn.jsdelivr.net/npm/mathjax@' + window.xiaoyaowudi_config.mathjax_version + '/es5/tex-mml-chtml'
        MathJax : 'https://cdn.bootcdn.net/ajax/libs/mathjax/' + window.xiaoyaowudi_config.mathjax_version + '/es5/tex-mml-chtml.min'
    },
    shim: {
        clipboard: {
            deps : ['css!https://at.alicdn.com/t/font_543384_kv876ayucyc.css']
        },
        highlightjs: {
            deps : [
                    // 'css!' + tools.get_file('style/highlightjs/' + window.xiaoyaowudi_config.code.highlightjs_theme + '.min.css')
                    'css!' + 'https://cdn.bootcdn.net/ajax/libs/highlight.js/' + window.xiaoyaowudi_config.code.highlightjs_version + '/styles/' + window.xiaoyaowudi_config.code.highlightjs_theme + '.min.css'
                   ]
        },
        mCustomScrollbar: {
            deps : ['css!' + tools.get_file('lib/mCustomScrollbar/' +
                                            window.xiaoyaowudi_config.mCustomScrollbar_version +
                                            '/jquery.mCustomScrollbar.min.css')]
        }
    }
});

function load() {
    Main.main();
}

$(document).ready(load);
$(document).on('pjax:complete', load);
