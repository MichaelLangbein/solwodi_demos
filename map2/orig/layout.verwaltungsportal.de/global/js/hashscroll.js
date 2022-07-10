(function( $, w, d ){

    'use strict';

    $( d ).ready( function(){
        function initialHashScroll()
        {
            window.location.hash && scrollToHashElement( window.location.hash, 0 );
        }

        function getTopFixedElement()
        {
            var selectors = ['.sticky-wrapper:first', '#navigation', '#topbar', '#menu'], $element = $();

            $.each( selectors, function( k, selector ){
                var $e = $( selector );

                // or sticky-wrapper because it may not be fixed when above static-position
                if( $e.length && $e.css( 'position' ) === 'fixed' || $e.is( '.sticky-wrapper' ) )
                {
                    // special case - if the visible navbar exists, take the inner header-element (bootstrap mobile)
                    if( $e.find( '.navbar-header:visible' ).length && ~~$e.find( '.navbar-header' ).outerHeight() )
                    {
                        $e = $e.find( '.navbar-header' );
                    }

                    if( ~~$e.outerHeight() )
                    {
                        $element = $e;
                        return false;
                    }
                }
            } );

            return $element;
        }

        function getOnePageIdByHash( hash )
        {
            var match = hash.match( /^#(op-)?(\d+).*?/ );

            return match === null ? 0 : ~~match[match.length - 1];
        }

        function getOnePageElementById( id )
        {
            return $( '#opc-' + id );
        }

        function isSameLocation( href )
        {
            href = href || '';

            if (href && href.substr(0, 1) !== '#')
            {
                var segments = href.match(/^(https?\:\/\/)?(?:www\.)?([^\/\?]+)?([\/\?]+[^#]*)?(?:#.*)?$/);

                var protocol = segments[1],
                    host     = segments[2],
                    pathname = segments[3]
                ;

                return (!protocol   || w.location.protocol === protocol)
                    && (!host       || w.location.host === host)
                    && (!pathname   || w.location.pathname === pathname )
                    ;
            }

            return true;
        }

        function scrollToHashElement( completeHash, animate )
        {
            //RegEx match is used to prevent escaping of already escaped characters
            if (completeHash && (completeHash.length > 0 && completeHash.match('\/') && !completeHash.match('(\\\\/)')) )
            {
                completeHash = completeHash.replace('/', '\\/');
            }

            completeHash = decodeURI(completeHash);

            var onePageHashId = getOnePageIdByHash( completeHash ), $e;

            if (onePageHashId)
            {
                $e = getOnePageElementById( onePageHashId );
            }
            else
            {
                $e = $( completeHash );
            }

            if( !$e.length )
            {
                $e = $( '[name="'+ completeHash.substr(1) +'"]:first' );
            }

            if(completeHash == '#') {
                $e = $('body');
            }

            if( $e.length )
            {
                var $fixedTop = getTopFixedElement(),
                    offset    = ~~$fixedTop.outerHeight(),
                    scrollTo  = $e.length && $e.offset().top - offset,
                    $html     = $( 'html, body' ),
                    manualScrollEvent = 'scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove'
                ;

                var handle = function(){
                    // animated
                    if( animate )
                    {
                        $html.on( manualScrollEvent, function(){$html.stop()} );

                        $html.animate( {scrollTop: scrollTo}, 900, function(){
                            $html.off( manualScrollEvent );

                            // supported by modern browsers - update hash without jumping
                            if( w.history.pushState )
                            {
                                w.history.pushState( null, null, completeHash );
                            }

                            // alternative - no onpage-element: temporarily remove hash-jump relevant attribute
                            else if( !onePageHashId )
                            {
                                var tmpId = $e.attr('id'), tmpName = $e.attr('name');

                                tmpId && $e.attr( 'id', 'tmp_' + tmpId );
                                tmpName && $e.attr( 'name', 'tmp_' + tmpName );

                                w.location.hash = completeHash;

                                w.setTimeout( function(){
                                    tmpId && $e.attr( 'id', tmpId );
                                    tmpName && $e.attr( 'name', tmpName );
                                }, 0 );
                            }

                            // alternative - onepage-element
                            else
                            {
                                w.location.hash = completeHash;
                            }
                        } );
                    }

                    // instant
                    else
                    {
                        $html.scrollTop( scrollTo );
                    }
                };

                handle();

                /*
                var $navbar = $( '.navbar-toggle:visible:not(.collapsed)' );

                if( $navbar.length )
                {
                    $( '.navbar-collapse' ).one( 'hidden.bs.collapse', handle );
                    $( '.navbar-toggle:not(.collapsed)' ).trigger( 'click' );
                }
                else
                {
                    handle();
                }
                */
            }
        }

        // prevent multiple includes
        if( !$( d ).data( 'hashScrollInitialized' ) )
        {
            $( d ).data( 'hashScrollInitialized', 1 );

            // hash-scroll
            w.setTimeout(initialHashScroll, 5);

            // execute again after initiation of potential external plugins
            $(window).on('load',function(  ){
                w.setTimeout(initialHashScroll, 5);
            });

            // hashlink
            $( 'a[href*="#"]' ).on( 'click', function( e ){
                if( isSameLocation( $( this ).attr( 'href' ) ) )
                {
                    e.preventDefault();
                    if( $( this ).attr( 'href' ) == '#' )
                    {
                        scrollToHashElement( '#', 1 );
                    }
                    else
                    {
                        scrollToHashElement( this.hash, 1 );
                    }
                }
            } );

            // old anker
            $( 'a[name]' ).on( 'click', function( e ){
                e.preventDefault();
                scrollToHashElement( '#' + $(this).attr('name'), 1 );
            } );

            // init scroller again if nivo-slider has been initialized
            var $slider = $( '#slider' );

            if( $slider.length )
            {
                $slider.find( 'img[src]:first' ).on('load', function(){
                    var _try = 0, hasHeight = function(){
                        !~~$slider.outerHeight() && _try++ < 10 && w.setTimeout( hasHeight, 100 ) || initialHashScroll();
                    };

                    hasHeight();
                } );
            }
        }
    } );
})
( jQuery, window, document );