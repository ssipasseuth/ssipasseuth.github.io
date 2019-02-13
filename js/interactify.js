var interactifyIdCounter = 1;
function uniqid(){
    return interactifyIdCounter++;
}

function setTimer(textComponent){
    var timer = setInterval(function() {
        var time = textComponent.getText();
        var token = time.split(':');
        var sec = parseInt(token[1]);
        var min = parseInt(token[0]);
        if(sec === 0){
            if(min === 0){
                //timeout!
                clearInterval(timer);

                //trigger event

            }else{
                sec = 59;
                min--;
            }
        }else{
            sec--;
        }

        if(min<10){
            min = '0' + min;
        }
        if(sec<10){
            sec = '0' + sec;
        }
        textComponent.setText(min + ':' + sec);
    }, 1000);
}

function setVisibilityToggle(selector, options){
    var $target = $(selector);

    if(options.hideInitially && options.hideInitially === true){
        $target.hide();
    }
    $(options.triggerShow).on(options.event, function(){
        $target.show();
    });
    if(options.triggerHide){
        $(options.triggerHide).on(options.event, function(){
            $target.hide();
        });
    }
}

function createSelectable(selectors, selectableCssClass){
    $(selectors).each(function(){
        var $element = $(this);
        var active = false;
        if(selectableCssClass){
            $element.addClass(selectableCssClass).on('click', function(){
                if(active === true){
                    $element.removeClass('active');
                    active = false;
                }else{
                    $element.addClass('active');
                    active = true;
                }
            });
        }
    });
}

function createRadioGroup(components, options){
    var selected = null;
    components.forEach(function(component){
        component.getElement('default').on('click', function(){
            component.setState('active');

            //toggle behaviour
            if(selected){
                selected.setState('default');
            }
            selected = component;

            if(options && options.callback){
                options.callback.call(null, selected);
            }
        });

        //special unselectable radio:
        if(options && options.unselectable){
            component.getElement('active').on('click', function(){
                component.setState('default');
                selected = null;
                if(options && options.callback){
                    options.callback.call(null, selected);
                }
            });
        }
    });
    return {
        getSelection : function getSelection(){
            return selected;
        }
    };
}

function createCheckboxGroup(components, options){
    //TODO max options for checkbox group
    var selection = {};
    var checkboxGroup = {
        getSelection : function getSelection(){
            var selectComponents = [];
            for (var serial in selection) {
                if (selection.hasOwnProperty(serial) && selection[serial]) {
                    selectComponents.push(selection[serial]);
                }
            }
            return selectComponents;
        }
    };

    components.forEach(function(component){
        component.getElement('default').on('click', function(){
            component.setState('active');
            if(!selection[component.getSerial()]){
                selection[component.getSerial()] = component;
            }
            selection[component.getSerial()] = component;

            //return callback
            if(options && options.callback){
                options.callback.call(checkboxGroup, checkboxGroup.getSelection());
            }
        });
        component.getElement('active').on('click', function(){
            component.setState('default');
            if(!selection[component.getSerial()]){
                selection[component.getSerial()] = false;
            }
            selection[component.getSerial()] = false;

            //return callback
            if(options && options.callback){
                options.callback.call(checkboxGroup, checkboxGroup.getSelection());
            }
        });
    });


}

function createComponent(states, options){
    var currentState = (options && options.initialState) ? options.initialState : 'default';
    var $dom = null;
    var serial = 'component' + uniqid();
    var component = {
        getSerial: function getSerial(){
            return serial;
        },
        setState : function setState(state){
            if(states[state]){
                if($dom){
                    $dom.hide();
                }
                $dom = $(states[state]).show();
                currentState = state;
            }else{
                throw new Error('invalid state: '+state);
            }
        },
        getElement : function getElement(state){
            if(state){
                if(states[state]){
                    return $(states[state]);
                }else {
                    throw new Error('unknown state: '+state);
                }
            }else{
                return $dom;
            }
        }
    };

    for (var key in states) {
        if (states.hasOwnProperty(key)) {
            $(states[key]).hide();
        }
    }

    component.setState(currentState);
    return component;
}

function createStyledComponent(selector, componentCssClass){
    var $dom = $(selector).addClass(componentCssClass);
    var serial = 'component' + uniqid();
    var component = {
        getSerial: function getSerial(){
            return serial;
        },
        setState : function setState(state){
            $dom.addClass(state);
        },
        is : function is(state){
            return $dom.hasClass(state);
        },
        removeState : function setState(state){
            $dom.removeClass(state);
        },
        getElement : function getElement(){
            return $dom;
        }
    };
    return component;
}

function createCarousel(component, options){
    var state = 0;
    var carousel = {
        next : function next(){
            if(state + 1 < options.sequence.length){
                state++;
                component.setState(options.sequence[state]);
                if(options.callback){
                    options.callback.call(this, state);
                }
            }
        },
        previous : function previous(){
            if(state - 1 >= 0){
                state--;
                component.setState(options.sequence[state]);
                if(options.callback){
                    options.callback.call(this, state);
                }
            }
        }
    };

    if(options.next){
        options.next.getElement().on('click', function(){
            carousel.next();
        })
    }
    if(options.previous){
        options.previous.getElement().on('click', function(){
            carousel.previous();
        })
    }

    return carousel;
}

function createScrollable(selector, options){
    $(selector).css({
        width: options.width || '100%',
        height: options.height,
        'overflow-y': 'auto',
        'overflow-x': 'hidden'
    });
}

function createTextArea(component, options){
    var $testArea = $('<textarea>').addClass('interactify');
    component.getElement().css('border', 'none').append($testArea);
    $testArea.on('change', function(){
        if(options && options.callback){
            options.callback.call(this, $testArea.val());
        }
    })
}

function createText(selector){
    var $textElement = $(selector);
    var textObj = {
        setText: function setText(text){
            if(text){
                $textElement.html(text);
            }
        },
        getText: function getText(){
            return $textElement.text();
        }
    };
    return textObj;
}

function createActivable(component, options){
    component.getElement('default').on('click', function(){
        component.setState('active');

        //TODO use event emitter instead!
        if(options && options.callback){
            options.callback.call(null, 'active');
        }
    });
    component.getElement('active').on('click', function(){
        component.setState('default');

        //TODO use event emitter instead!
        if(options && options.callback){
            options.callback.call(null, 'default');
        }
    });
}

function createSortable(sortable, options){
    sortable.getElement().children().addClass('list-group-item').css({
        position: 'relative',
        top: 0,
        'margin-bottom': 20,
    });
    new Sortable(sortable.getElement().get(0), {
        animation: 150,
        ghostClass: 'sortable-ghost',
        onSort : function onSort(){
            //TODO use event emitter instead!
            if(options && options.callback){
                options.callback.call();
            }
        }
    });
}

// credit: http://www.javascriptkit.com/javatutors/touchevents2.shtml
function swipedetect(component, callback){
    var myRegion = new ZingTouch.Region(component.getElement().get(0));
    myRegion.bind(component.getElement().get(0), 'swipe', function(e){
        var dir = e.detail.data[0].currentDirection;
        if(0 < dir && dir < 20 || dir > 340){
            callback('right');
        }else if(160 < dir && dir < 200){
            callback('left');
        }
    });
}