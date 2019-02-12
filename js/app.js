$(function () {
    // createSelectable('.componentchoicestaticcontrolnoaction, .componentchoicestaticcontrolnoaction1, .componentchoicestaticcontrolnoaction2', 'activable-choice');

    var interaction1_choiceA = createComponent({
       default:  '.item1 .choiceadefault',
       active:  '.item1 .choiceaactive'
    });
    var interaction1_choiceB = createComponent({
        default:  '.item1 .choicebdefault',
        active:  '.item1 .choicebactive'
    });
    var interaction1_choiceC = createComponent({
        default:  '.item1 .choicecdefault',
        active:  '.item1 .choicecactive'
    });
    var interaction1_choiceD = createComponent({
        default:  '.item1 .choiceddefault',
        active:  '.item1 .choicedactive'
    });

    var interaction3_choiceA = createComponent({
        default:  '.item3 .choiceadefault',
        active:  '.item3 .choiceaactive'
    });
    var interaction3_choiceB = createComponent({
        default:  '.item3 .choicebdefault',
        active:  '.item3 .choicebactive'
    });
    var interaction3_choiceC = createComponent({
        default:  '.item3 .choicecdefault',
        active:  '.item3 .choicecactive'
    });
    var interaction3_choiceD = createComponent({
        default:  '.item3 .choiceddefault',
        active:  '.item3 .choicedactive'
    });

    var testContent = createComponent({
        'default':  '.item1',
        'item2':  '.item2',
        'item3':  '.item3'
    });
    var nextButton = createComponent({
        'default': '.btnnext'
    });
    var prevButton = createComponent({
        'default': '.btnback'
    });

    var textArea = createComponent({
        'default': '.item2 .rectangle1'
    });

    var itemNumber = createText('.item1220');

    var item1 = createStyledComponent('.item1', 'item');
    var item2 = createStyledComponent('.item2', 'item');
    var item3 = createStyledComponent('.item3', 'item');

    //quick hack to initially hide all bookmarks
    $('.paneloverview .bookmarkon').hide();
    var overviewItem1 = createStyledComponent('.componentoverviewrow8', 'overview-row');
    var overviewItem2 = createStyledComponent('.componentoverviewrow9', 'overview-row');
    var overviewItem3 = createStyledComponent('.componentoverviewrow10', 'overview-row');

    var bookmarkToggle = createComponent({
        default: '.btnbookmarkinitial',
        active: '.btnbooknarkactive'
    });

    var bookmarkCount = 0;
    var textBookmarkCounter = createText('.bookmarked0');

    function getItem(){
        switch(itemPos){
            case 0:
                return overviewItem1;
            case 1:
                return overviewItem2;
            case 2:
                return overviewItem3;
        }
    }

    createActivable(bookmarkToggle, {
        callback: function cb(status){
            if(status === 'active'){
                getItem().setState('bookmarked');
                bookmarkCount++;
            }else{
                getItem().removeState('bookmarked');
                bookmarkCount--;
            }
            textBookmarkCounter.setText('BOOKMARKED (' + bookmarkCount + ')');
        }
    });

    //test navigation
    var itemPos = 0;
    createCarousel(testContent, {
        sequence: ['default', 'item2', 'item3'],
        next: nextButton,
        previous: prevButton,
        callback: function cb(pos){
            itemNumber.setText('ITEM '+ (12 + pos) + '/20');
            itemPos = pos;

            if(getItem().is('bookmarked')){
                bookmarkToggle.setState('active');
            }else{
                bookmarkToggle.setState('default');
            }
        }
    });

    //item interaction
    createRadioGroup([interaction1_choiceA, interaction1_choiceB, interaction1_choiceC, interaction1_choiceD], {
        unselectable:true,
        callback:function cb(selection){
            if(selection){
                overviewItem1.setState('answered');
            }else{
                overviewItem1.removeState('answered');
            }
        }
    });
    var interaction2 = createTextArea(textArea, {
        callback:function cb(text){
            if(text){
                overviewItem2.setState('answered');
            }else{
                overviewItem2.removeState('answered');
            }
        }
    });
    var interaction3 = createCheckboxGroup([interaction3_choiceA, interaction3_choiceB, interaction3_choiceC, interaction3_choiceD], {
        callback:function cb(text){
            if(text){
                overviewItem3.setState('answered');
            }else{
                overviewItem3.removeState('answered');
            }
        }
    });

    createScrollable('.paneloverview .scrollable', {
        height: 490
    });

    setVisibilityToggle('.paneloverview', {
        hideInitially: true,
        event: 'click',
        triggerShow: '.btnoverview',
        triggerHide: '.icon16remove',
    });

    setTimer('.a2755', {});


});