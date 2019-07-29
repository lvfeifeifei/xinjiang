/***
GLobal Directives全局指令
***/


// Route State Load Spinner(used on page or content load)
MetronicApp.directive('ngSpinnerBar', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, element, attrs) {
                // by defult hide the spinner bar
                element.addClass('hide'); // hide spinner bar by default

                // display the spinner bar whenever the route changes(the content part started loading)
                $rootScope.$on('$stateChangeStart', function() {
                    element.removeClass('hide'); // show spinner bar
                });

                // hide the spinner bar on rounte change success(after the content loaded)
                $rootScope.$on('$stateChangeSuccess', function() {
                    element.addClass('hide'); // hide spinner bar
                    $('body').removeClass('page-on-load'); // remove page loading indicator
                    Layout.setSidebarMenuActiveLink('match'); // activate selected link in the sidebar menu

                    // auto scorll to page top
                    setTimeout(function () {
                        App.scrollTop(); // scroll to the top on content load
                    }, $rootScope.settings.layout.pageAutoScrollOnLoad);
                });

                // handle errors
                $rootScope.$on('$stateNotFound', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                // handle errors
                $rootScope.$on('$stateChangeError', function() {
                    element.addClass('hide'); // hide spinner bar
                });

                $rootScope.$on('spinnerShow', function () {
                    element.removeClass('hide'); // show spinner bar
                });

                $rootScope.$on('spinnerHide', function () {
                    setTimeout(function () {
                        element.addClass('hide'); // hide spinner bar
                    }, 500);
                    $("html, body").animate({
                        scrollTop: 0
                    }, 500);
                });
            }
        };
    }
]);

/**
	 * breadcrumbs（面包屑导航） begin -->>
	 */
MetronicApp.directive('breadcrumbs', function factory($rootScope, $state, $stateParams, $interpolate, $location) {
    return {
        restrict: 'AE',
        replace: true,
        templateUrl: "tpl/tpl_breadcrumb.html",
        scope: {},
        link: function (scope) {
            scope.steps = updateBreadcrumbs();
            scope.$on('$stateChangeSuccess', function () {
                scope.steps = updateBreadcrumbs();
            });
        }
    };
    //更新当前的面包屑
    function updateBreadcrumbs() {
        var breadcrumbs = [];
        for (var curState = $state.$current.name; curState; curState = breadcrumbParentState(curState)) {
            generateBreadcrumbs(breadcrumbs, curState);
        }
        return breadcrumbs.reverse();
    }
    //生成面包屑
    function generateBreadcrumbs(chain, stateName) {
        var skip = false;
        var displayName, breadcrumbLabel;
        //如果状态已经存在状态链中，直接返回
        for (var i = 0; i < chain.length; i++) {
            if (chain[i].name === stateName) { return; }
        }
        var state = $state.get(stateName);
        if (state.ncyBreadcrumb && state.ncyBreadcrumb.label) {
            breadcrumbLabel = state.ncyBreadcrumb.label;
            displayName = $interpolate(breadcrumbLabel)($rootScope);
        } else {
            displayName = state.name;
        }
        if (state.ncyBreadcrumb) {
            if (state.ncyBreadcrumb.skip) { skip = true; }
        }
        // if (!skip && !state.abstract) {
        if (!skip) {
            //如果当前状态不是抽象的，并且skip为false //需要显示参数的面包屑
            if (state.ncyBreadcrumb && state.ncyBreadcrumb.param) {
                chain.push({
                    link: stateName,
                    label: $stateParams[state.ncyBreadcrumb.param],
                    abstract: state.abstract
                });
            }
            chain.push({
                link: stateName,
                label: displayName,
                abstract: state.abstract
            });
        }
    }
    //返回当前状态或者当前状态的父状态
    function breadcrumbParentState(stateName) {
        var curState = $state.get(stateName);
        if (curState.abstract) {return;}
        //如果状态配置了面包屑对象，并且配置了parent属性
        if (curState.ncyBreadcrumb && curState.ncyBreadcrumb.parent) {
            var isFunction = typeof curState.ncyBreadcrumb.parent === 'function';
            //判断父状态的配置属性是否是函数
            var parentStateRef = isFunction ? curState.ncyBreadcrumb.parent($rootScope) : curState.ncyBreadcrumb.parent;
            if (parentStateRef) { return parentStateRef; }
        }
        //返回当前状态的父状态
        //var parent = curState.parent (/^(.+)\.[^.]+$/.exec(curState.name) [])[1];
        var parent = curState.parent || (/^(.+)\.[^.]+$/.exec(curState.name) || [])[1];
        var isObjectParent = typeof parent === "object";
        return isObjectParent ? parent.name : parent;
    }
});

// Handle global LINK click
MetronicApp.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Handle Dropdown Hover Plugin Integration
MetronicApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };
});
