/**
 * @author:   * @date: 2015/12/31
 */
define(["core/js/layout/FluidLayout",
        "core/js/CommonConstant",
        "core/js/view/Region",
        "core/js/controls/Icon",
        "core/js/utils/ViewUtils"],
    function (FluidLayout, CommonConstant,Region,Icon,ViewUtils) {
        var view = FluidLayout.extend({
            defaultColumnSize: $Column.COL_MD_12,
            items: null,
            initItems:function(options){
                this.items = [
                {
                    comXtype:$Component.PANEL,
                    comConf:{
                        title:"Icons",
                        theme:$Theme.BLUE,
                        help:"内容",
                        brief:" More Than 360 Font Awesome Icons",
                        iconSkin:ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                        mainRegion:{
                            comXtype:$Component.FLUIDLAYOUT,
                            comConf:{
                            defaultColumnSize: $Column.COL_MD_3,
                                items:this.createIconItem()
                        }
                    }
                }
                },{
                        comXtype:$Component.PANEL,
                        className:$Column.COL_MD_6,
                        comConf:{
                        title:"大小",
                            theme:$Theme.BLUE,
                            iconSkin:ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion:{
                                comXtype:$Component.FLUIDLAYOUT,
                                comConf:{
                                defaultColumnSize: $Column.COL_MD_3,
                                    items:this.createItems(CommonConstant.IconSize,"size"),
                            },
                        }
                    }
                },{
                        comXtype:$Component.PANEL,
                        className:$Column.COL_MD_6,
                        comConf:{
                        title:"旋转",
                            theme:$Theme.BLUE,
                            iconSkin:ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion:{
                                comXtype:$Component.FLUIDLAYOUT,
                                comConf:{
                                defaultColumnSize: $Column.COL_MD_3,
                                    items:this.createItems(CommonConstant.IconRotate,"rotated"),
                            },
                        }
                    }
                },{
                        comXtype:$Component.PANEL,
                        className:$Column.COL_MD_6,
                        comConf:{
                        title:"装饰",
                            theme:$Theme.BLUE,
                            iconSkin:ViewUtils.createIconClass(CommonConstant.Icon.EDIT),
                            mainRegion:{
                                comXtype:$Component.FLUIDLAYOUT,
                                comConf:{
                                defaultColumnSize: $Column.COL_MD_3,
                                    items:this.createItems(CommonConstant.IconStacked,"stacked"),
                            },
                        }
                    }
                } ] ;
            },
            createIconItem:function(){
                var items = [];
                for(var i in CommonConstant.Icon){
                    var icon = CommonConstant.Icon[i];
                    items.push(
                        {
                            comRef:new Icon({
                                icon:icon,
                                text:icon
                            }),
                        });
                }
                return items;
            },
            /**
             * 获取元素
             * @param arr   枚举对象
             * @param prop  属性
             */
            createItems:function (arr,prop) {
                var items = [];
                for(var i in arr){
                    var value = arr[i];
                    var obj = {
                        icon:CommonConstant.Icon.SHIELD,
                        text:value
                    }
                    obj[prop] = value;
                    items.push({
                        comRef:new Icon(obj),
                    });
                }
                return items;
            }
        });

        return view;
    });

/* GLYPHICON_ASTERISK:"glyphicon-asterisk",
 GLYPHICON_PLUS:"glyphicon-plus",
 GLYPHICON_EURO:"glyphicon-euro",
 GLYPHICON_MINUS:"glyphicon-minus",
 GLYPHICON_CLOUD:"glyphicon-cloud",
 GLYPHICON_ENVELOPE:"glyphicon-envelope",
 GLYPHICON_PENCIL:"glyphicon-pencil",
 GLYPHICON_GLASS:"glyphicon-glass",
 GLYPHICON_MUSIC:"glyphicon-music",
 GLYPHICON_SEARCH:"glyphicon-search",
 GLYPHICON_HEART:"glyphicon-heart",
 GLYPHICON_STAR:"glyphicon-star",
 GLYPHICON_STAR_EMPTY:"glyphicon-star-empty",
 GLYPHICON_USER:"glyphicon-user",
 GLYPHICON_FILM:"glyphicon-film",
 GLYPHICON_TH_LARGE:"glyphicon-th-large",
 GLYPHICON_TH:"glyphicon-th",
 GLYPHICON_TH_LIST:"glyphicon-th-list",
 GLYPHICON_OK:"glyphicon-ok",
 GLYPHICON_REMOVE:"glyphicon-remove",
 GLYPHICON_ZOOM_IN:"glyphicon-zoom-in",
 GLYPHICON_ZOOM_OUT:"glyphicon-zoom-out",
 GLYPHICON_OFF:"glyphicon-off",
 GLYPHICON_SIGNAL:"glyphicon-signal",
 GLYPHICON_COG:"glyphicon-cog",
 GLYPHICON_TRASH:"glyphicon-trash",
 GLYPHICON_HOME:"glyphicon-home",
 GLYPHICON_FILE:"glyphicon-file",
 GLYPHICON_TIME:"glyphicon-time",
 GLYPHICON_ROAD:"glyphicon-road",
 GLYPHICON_DOWNLOAD_ALT:"glyphicon-download-alt",
 GLYPHICON_DOWNLOAD:"glyphicon-download",
 GLYPHICON_UPLOAD:"glyphicon-upload",
 GLYPHICON_INBOX:"glyphicon-inbox",
 GLYPHICON_PLAY_CIRCLE:"glyphicon-play-circle",
 GLYPHICON_REPEAT:"glyphicon-repeat",
 GLYPHICON_REFRESH:"glyphicon-refresh",
 GLYPHICON_LIST_ALT:"glyphicon-list-alt",
 GLYPHICON_LOCK:"glyphicon-lock",
 GLYPHICON_FLAG:"glyphicon-flag",
 GLYPHICON_HEADPHONES:"glyphicon-headphones",
 GLYPHICON_VOLUME_OFF:"glyphicon-volume-off",
 GLYPHICON_VOLUME_DOWN:"glyphicon-volume-down",
 GLYPHICON_VOLUME_UP:"glyphicon-volume-up",
 GLYPHICON_QRCODE:"glyphicon-qrcode",
 GLYPHICON_BARCODE:"glyphicon-barcode",
 GLYPHICON_TAG:"glyphicon-tag",
 GLYPHICON_TAGS:"glyphicon-tags",
 GLYPHICON_BOOK:"glyphicon-book",
 GLYPHICON_BOOKMARK:"glyphicon-bookmark",
 GLYPHICON_PRINT:"glyphicon-print",
 GLYPHICON_CAMERA:"glyphicon-camera",
 GLYPHICON_FONT:"glyphicon-font",
 GLYPHICON_BOLD:"glyphicon-bold",
 GLYPHICON_ITALIC:"glyphicon-italic",
 GLYPHICON_TEXT_HEIGHT:"glyphicon-text-height",
 GLYPHICON_TEXT_WIDTH:"glyphicon-text-width",
 GLYPHICON_ALIGN_LEFT:"glyphicon-align-left",
 GLYPHICON_ALIGN_CENTER:"glyphicon-align-center",
 GLYPHICON_ALIGN_RIGHT:"glyphicon-align-right",
 GLYPHICON_ALIGN_JUSTIFY:"glyphicon-align-justify",
 GLYPHICON_LIST:"glyphicon-list",
 GLYPHICON_INDENT_LEFT:"glyphicon-indent-left",
 GLYPHICON_INDENT_RIGHT:"glyphicon-indent-right",
 GLYPHICON_FACETIME_VIDEO:"glyphicon-facetime-video",
 GLYPHICON_PICTURE:"glyphicon-picture",
 GLYPHICON_MAP_MARKER:"glyphicon-map-marker",
 GLYPHICON_ADJUST:"glyphicon-adjust",
 GLYPHICON_TINT:"glyphicon-tint",
 GLYPHICON_EDIT:"glyphicon-edit",
 GLYPHICON_SHARE:"glyphicon-share",
 GLYPHICON_CHECK:"glyphicon-check",
 GLYPHICON_MOVE:"glyphicon-move",
 GLYPHICON_STEP_BACKWARD:"glyphicon-step-backward",
 GLYPHICON_FAST_BACKWARD:"glyphicon-fast-backward",
 GLYPHICON_BACKWARD:"glyphicon-backward",
 GLYPHICON_PLAY:"glyphicon-play",
 GLYPHICON_PAUSE:"glyphicon-pause",
 GLYPHICON_STOP:"glyphicon-stop",
 GLYPHICON_FORWARD:"glyphicon-forward",
 GLYPHICON_FAST_FORWARD:"glyphicon-fast-forward",
 GLYPHICON_STEP_FORWARD:"glyphicon-step-forward",
 GLYPHICON_EJECT:"glyphicon-eject",
 GLYPHICON_CHEVRON_LEFT:"glyphicon-chevron-left",
 GLYPHICON_CHEVRON_RIGHT:"glyphicon-chevron-right",
 GLYPHICON_PLUS_SIGN:"glyphicon-plus-sign",
 GLYPHICON_MINUS_SIGN:"glyphicon-minus-sign",
 GLYPHICON_REMOVE_SIGN:"glyphicon-remove-sign",
 GLYPHICON_OK_SIGN:"glyphicon-ok-sign",
 GLYPHICON_QUESTION_SIGN:"glyphicon-question-sign",
 GLYPHICON_INFO_SIGN:"glyphicon-info-sign",
 GLYPHICON_SCREENSHOT:"glyphicon-screenshot",
 GLYPHICON_REMOVE_CIRCLE:"glyphicon-remove-circle",
 GLYPHICON_OK_CIRCLE:"glyphicon-ok-circle",
 GLYPHICON_BAN_CIRCLE:"glyphicon-ban-circle",
 GLYPHICON_ARROW_LEFT:"glyphicon-arrow-left",
 GLYPHICON_ARROW_RIGHT:"glyphicon-arrow-right",
 GLYPHICON_ARROW_UP:"glyphicon-arrow-up",
 GLYPHICON_ARROW_DOWN:"glyphicon-arrow-down",
 GLYPHICON_SHARE_ALT:"glyphicon-share-alt",
 GLYPHICON_RESIZE_FULL:"glyphicon-resize-full",
 GLYPHICON_RESIZE_SMALL:"glyphicon-resize-small",
 GLYPHICON_EXCLAMATION_SIGN:"glyphicon-exclamation-sign",
 GLYPHICON_GIFT:"glyphicon-gift",
 GLYPHICON_LEAF:"glyphicon-leaf",
 GLYPHICON_FIRE:"glyphicon-fire",
 GLYPHICON_EYE_OPEN:"glyphicon-eye-open",
 GLYPHICON_EYE_CLOSE:"glyphicon-eye-close",
 GLYPHICON_WARNING_SIGN:"glyphicon-warning-sign",
 GLYPHICON_PLANE:"glyphicon-plane",
 GLYPHICON_CALENDAR:"glyphicon-calendar",
 GLYPHICON_RANDOM:"glyphicon-random",
 GLYPHICON_COMMENT:"glyphicon-comment",
 GLYPHICON_MAGNET:"glyphicon-magnet",
 GLYPHICON_CHEVRON_UP:"glyphicon-chevron-up",
 GLYPHICON_CHEVRON_DOWN:"glyphicon-chevron-down",
 GLYPHICON_RETWEET:"glyphicon-retweet",
 GLYPHICON_SHOPPING_CART:"glyphicon-shopping-cart",
 GLYPHICON_FOLDER_CLOSE:"glyphicon-folder-close",
 GLYPHICON_FOLDER_OPEN:"glyphicon-folder-open",
 GLYPHICON_RESIZE_VERTICAL:"glyphicon-resize-vertical",
 GLYPHICON_RESIZE_HORIZONTAL:"glyphicon-resize-horizontal",
 GLYPHICON_HDD:"glyphicon-hdd",
 GLYPHICON_BULLHORN:"glyphicon-bullhorn",
 GLYPHICON_BELL:"glyphicon-bell",
 GLYPHICON_CERTIFICATE:"glyphicon-certificate",
 GLYPHICON_THUMBS_UP:"glyphicon-thumbs-up",
 GLYPHICON_THUMBS_DOWN:"glyphicon-thumbs-down",
 GLYPHICON_HAND_RIGHT:"glyphicon-hand-right",
 GLYPHICON_HAND_LEFT:"glyphicon-hand-left",
 GLYPHICON_HAND_UP:"glyphicon-hand-up",
 GLYPHICON_HAND_DOWN:"glyphicon-hand-down",
 GLYPHICON_CIRCLE_ARROW_RIGHT:"glyphicon-circle-arrow-right",
 GLYPHICON_CIRCLE_ARROW_LEFT:"glyphicon-circle-arrow-left",
 GLYPHICON_CIRCLE_ARROW_UP:"glyphicon-circle-arrow-up",
 GLYPHICON_CIRCLE_ARROW_DOWN:"glyphicon-circle-arrow-down",
 GLYPHICON_GLOBE:"glyphicon-globe",
 GLYPHICON_WRENCH:"glyphicon-wrench",
 GLYPHICON_TASKS:"glyphicon-tasks",
 GLYPHICON_FILTER:"glyphicon-filter",
 GLYPHICON_BRIEFCASE:"glyphicon-briefcase",
 GLYPHICON_FULLSCREEN:"glyphicon-fullscreen",
 GLYPHICON_DASHBOARD:"glyphicon-dashboard",
 GLYPHICON_PAPERCLIP:"glyphicon-paperclip",
 GLYPHICON_HEART_EMPTY:"glyphicon-heart-empty",
 GLYPHICON_LINK:"glyphicon-link",
 GLYPHICON_PHONE:"glyphicon-phone",
 GLYPHICON_PUSHPIN:"glyphicon-pushpin",
 GLYPHICON_USD:"glyphicon-usd",
 GLYPHICON_GBP:"glyphicon-gbp",
 GLYPHICON_SORT:"glyphicon-sort",
 GLYPHICON_SORT_BY_ALPHABET:"glyphicon-sort-by-alphabet",
 GLYPHICON_SORT_BY_ALPHABET_ALT:"glyphicon-sort-by-alphabet-alt",
 GLYPHICON_SORT_BY_ORDER:"glyphicon-sort-by-order",
 GLYPHICON_SORT_BY_ORDER_ALT:"glyphicon-sort-by-order-alt",
 GLYPHICON_SORT_BY_ATTRIBUTES:"glyphicon-sort-by-attributes",
 GLYPHICON_SORT_BY_ATTRIBUTES_ALT:"glyphicon-sort-by-attributes-alt",
 GLYPHICON_UNCHECKED:"glyphicon-unchecked",
 GLYPHICON_EXPAND:"glyphicon-expand",
 GLYPHICON_COLLAPSE_DOWN:"glyphicon-collapse-down",
 GLYPHICON_COLLAPSE_UP:"glyphicon-collapse-up",
 GLYPHICON_LOG_IN:"glyphicon-log-in",
 GLYPHICON_FLASH:"glyphicon-flash",
 GLYPHICON_LOG_OUT:"glyphicon-log-out",
 GLYPHICON_NEW_WINDOW:"glyphicon-new-window",
 GLYPHICON_RECORD:"glyphicon-record",
 GLYPHICON_SAVE:"glyphicon-save",
 GLYPHICON_OPEN:"glyphicon-open",
 GLYPHICON_SAVED:"glyphicon-saved",
 GLYPHICON_IMPORT:"glyphicon-import",
 GLYPHICON_EXPORT:"glyphicon-export",
 GLYPHICON_SEND:"glyphicon-send",
 GLYPHICON_FLOPPY_DISK:"glyphicon-floppy-disk",
 GLYPHICON_FLOPPY_SAVED:"glyphicon-floppy-saved",
 GLYPHICON_FLOPPY_REMOVE:"glyphicon-floppy-remove",
 GLYPHICON_FLOPPY_SAVE:"glyphicon-floppy-save",
 GLYPHICON_FLOPPY_OPEN:"glyphicon-floppy-open",
 GLYPHICON_CREDIT_CARD:"glyphicon-credit-card",
 GLYPHICON_TRANSFER:"glyphicon-transfer",
 GLYPHICON_CUTLERY:"glyphicon-cutlery",
 GLYPHICON_HEADER:"glyphicon-header",
 GLYPHICON_COMPRESSED:"glyphicon-compressed",
 GLYPHICON_EARPHONE:"glyphicon-earphone",
 GLYPHICON_PHONE_ALT:"glyphicon-phone-alt",
 GLYPHICON_TOWER:"glyphicon-tower",
 GLYPHICON_STATS:"glyphicon-stats",
 GLYPHICON_SD_VIDEO:"glyphicon-sd-video",
 GLYPHICON_HD_VIDEO:"glyphicon-hd-video",
 GLYPHICON_SUBTITLES:"glyphicon-subtitles",
 GLYPHICON_SOUND_STEREO:"glyphicon-sound-stereo",
 GLYPHICON_SOUND_DOLBY:"glyphicon-sound-dolby",
 GLYPHICON_SOUND_5_1:"glyphicon-sound-5-1",
 GLYPHICON_SOUND_6_1:"glyphicon-sound-6-1",
 GLYPHICON_SOUND_7_1:"glyphicon-sound-7-1",
 GLYPHICON_COPYRIGHT_MARK:"glyphicon-copyright-mark",
 GLYPHICON_REGISTRATION_MARK:"glyphicon-registration-mark",
 GLYPHICON_CLOUD_DOWNLOAD:"glyphicon-cloud-download",
 GLYPHICON_CLOUD_UPLOAD:"glyphicon-cloud-upload",
 GLYPHICON_TREE_CONIFER:"glyphicon-tree-conifer",
 GLYPHICON_TREE_DECIDUOUS:"glyphicon-tree-deciduous",*/