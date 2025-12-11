/* JS for preset "Menu V2" */
(function() {
	$(function() {
		$('.menu-wrapper').each(function() {
			initMenu($(this))
		});
	});

	// Make :active pseudo classes work on iOS
	document.addEventListener("touchstart", function() {}, false);

	var initMenu = function($menuWrapper) {
		var $body = $('body');
		var $menu = $('.ed-menu', $menuWrapper);
		var $menuLinks = $('a', $menu);
		var $menuTrigger = $('.menu-trigger', $menuWrapper);
		var $banner = $('.banner').first();

		var menuWrapperHeight = $menuWrapper.outerHeight();
		var bannerHeight = $banner.length ? $banner.outerHeight() : 0;
		var smoothScrollOffset = 20;
		
		toggleClassOnClick($body.add($menu), $menuTrigger, null, 'open open-menu'); // Keep open on $menu for backward compatibility
		activateSmoothScroll($menuLinks.add($('.scroll a')), smoothScrollOffset);
		addClassOnVisibleLinkTargets($menuLinks, 'active', 2 / 3);
		handleSticky($menuWrapper, 'sticky', $banner);
	};

	/**
	 * Observe element's height changes and reload the initMenu() function
	 *
	 * @param {HTMLElement} elm Element to observe
	 * @param {function} callback to call when elmement's height changed
	 */
	var observeHeightChange = function(elm, callback) {
		if (!('ResizeObserver' in window) || elm == null) return;

		var ro = new ResizeObserver(callback);
		ro.observe(elm);
	}

	/**
	 * Toggles class on a target when a trigger is clicked
	 * 
	 * @param {jQuery} $target The target to apply the CSS class to
	 * @param {jQuery} $trigger The Trigger
	 * @param {jQuery} $closeTrigger Optional close trigger
	 * @param {string} cssClass CSS Class to toggle on the target
	 */
	var toggleClassOnClick = function($target, $trigger, $closeTrigger, cssClass) {

		// Reset in case class "open" was saved accidentally
		$target.removeClass(cssClass);
		$trigger.removeClass(cssClass);

		// Click on trigger toggles class "open"
		$trigger.off('.toggle').on('click.toggle', function() {
			$(this).toggleClass(cssClass);
			$target.toggleClass(cssClass);
		});

		// Close target when link inside is clicked
		$target.find('a').click(function() {
			$target.removeClass(cssClass);
			$trigger.removeClass(cssClass);
		});

		if (!$closeTrigger || !$closeTrigger.length) {
			return;
		}

		$closeTrigger.click(function() {
			$target.removeClass(cssClass);
			$trigger.removeClass(cssClass);
		});
	};

	/**
	 * Smooth scroll to link targets
	 * 
	 * @param {jQuery} $scrollLinks The links
	 * @param {jQuery} scrollOffset Offset to subtract from the scroll target position (e.g. for fixed positioned elements like a menu)
	 */
	var activateSmoothScroll = function($scrollLinks, scrollOffset) {
		if (typeof scrollOffset === 'undefined') {
			scrollOffset = 0;
		}

		var determineTarget = function($trigger, hash) {
			if (hash == '#!next') {
				return $trigger.closest('.ed-element').next();
			}

			return $(hash);
		}

		$scrollLinks.click(function(e) {
			var $target = determineTarget($(this), this.hash);
			if (!$target.length) return;
			e.preventDefault();

			viewport.scrollTo($target, 'top', 500, 0);

		});
	};

	/**
	 * We are using the fill property on an element to pass user's choices from CSS to JavaScript
	 * 
	 * @param {jQuery} $element
	 */
	var getStickyMode = function($element) {
		var fillValue = getComputedStyle($element[0]).fill;

		return fillValue === 'rgb(255, 0, 0)' ?
			'sticky_banner' :
			fillValue === 'rgb(0, 255, 0)' ?
			'sticky_menu' :
			fillValue === 'rgb(0, 0, 255)' ?
			'sticky_instant' :
			fillValue === 'rgb(255, 255, 255)' ?
			'sticky_reverse' :
			'sticky_none';
	};

	/**
	 * Adds a class to an element when not currently visible
	 * 
	 * @param {jQuery} $element The element to handle stickyness for
	 * @param {string} cssClass The actual CSS class to be applied to the element when it's above a certain scroll position
	 * @param {jQuery} $banner A banner to reference the scroll position to
	 */
	var handleSticky = function($element, cssClass, $banner) {
		var triggerPos = 0,
			offset = 0;
		var menuWrapperHeight = $element.outerHeight();
		var mode;
		var prevScroll = 0;
		$element.removeClass(cssClass);
		
		var toggleSpacer = function(toggle) {
			document.body.style.setProperty('--spacer-height', toggle ? menuWrapperHeight + 'px' : '');
		};

		var handleScroll = function() {
			if (!$element.length || mode === 'sticky_none') return;

			var isReverse = mode === 'sticky_reverse',
				curScroll = viewport.getScrollTop();

			if (triggerPos <= curScroll && (!isReverse || prevScroll > curScroll)) {
				$element.addClass(cssClass);
				toggleSpacer(true);
			} else {
				$element.removeClass(cssClass);
				toggleSpacer(false);
			}

			prevScroll = curScroll;
		};
		
		var updateOffset = function() {
			mode = getStickyMode($element);
			menuWrapperHeight = $element.outerHeight();
			if (!$element.hasClass(cssClass)) {
				offset = $element.offset().top;
			}
			if (mode === 'sticky_banner' && !$banner.length) {
				mode = 'sticky_menu';
			}
			if (mode === 'sticky_banner') {
				triggerPos = $banner.offset().top + ($banner.length ? $banner.outerHeight() : $element.outerHeight());
			}
			if (mode === 'sticky_menu' || mode === 'sticky_reverse') {
				triggerPos = offset + $element.outerHeight();
			}
			if (mode === 'sticky_instant') {
				triggerPos = offset;
			}
			
			handleScroll();
		}
		
		viewport.observe('resize', updateOffset);
		viewport.observe('animation.end', updateOffset);
		observeHeightChange($element[0], updateOffset);
		updateOffset();
		
		viewport.observe('scroll', handleScroll);
		handleScroll();
	};

	/**
	 * Adds a class to links whose target is currently inside the viewport
	 * 
	 * @param {jQuery} $links Link(s) to be observed
	 * @param {string} cssClass CSS Class to be applied
	 * @param {float} sectionViewportRatio Ratio by which the target should be within the viewport
	 */
	var addClassOnVisibleLinkTargets = function($links, cssClass, sectionViewportRatio) {
		if (typeof sectionViewportRatio === 'undefined') {
			sectionViewportRatio = 1 / 2;
		}

		var menuTargets = [];
		var activeLink = $links.filter('.active:not(.wv-link-elm)').eq(0);

		var links = $links.filter(function() {
			var $target = $(this.hash);
			if (!$target.length) {
				return false;
			}

			// Cache offset position to improve performance (update on resize)		
			var updateOffset = function() {
				$target.data('offset', $target.offset().top);
			};

			viewport.observe('resize', updateOffset);
			viewport.observe('animation.end', updateOffset);
			updateOffset();

			menuTargets.push($target);
			return true;
		});

		// No hash links found, so don't handle it at all
		if (!links.length) {
			return;
		}

		var checkVisibility = function() {
			$links.removeClass('active');

			// Check section position reversely
			for (var i = menuTargets.length - 1; i >= 0; i--) {
				var desiredScrollPosition = menuTargets[i].data('offset') - viewport.getHeight() * (1 - sectionViewportRatio);
				if (viewport.getScrollTop() >= desiredScrollPosition && menuTargets[i][0].offsetParent !== null) {
					links.eq(i).addClass(cssClass);
					return;
				}
			}

			// Fallback to originally active item
			activeLink.addClass(cssClass);
		};

		viewport.observe('scroll', checkVisibility);
		checkVisibility();
	};
})();
/* End JS for preset "Menu V2" */

/* JS for preset "Content Slider" */
$(function() {
	if (document.body.classList.contains('edit') || document.body.classList.contains('preview')) {
		return;
	}

	viewport.promise('api.slick.ready', function() {
		viewport.jQuery('.content-slider-wrap > .inner').slick({
			autoplay: true,
			arrows: true,
			prevArrow: '<button type="button" data-role="none" class="slick-prev" tabindex="0" role="button"></button>',
			nextArrow: '<button type="button" data-role="none" class="slick-next" tabindex="0" role="button"></button>',
			speed: 300,
			autoplaySpeed: 3000,
			dots: false,
			adaptiveHeight: true,
			fade: false
		});
	}).requireSlick();
});

/* End JS for preset "Content Slider" */

/* JS for preset "Counter" */
$(function() {
	EasingFunctions = {
		// no easing, no acceleration
		linear: function(t) {
			return t
		},
		// accelerating from zero velocity
		easeInQuad: function(t) {
			return t * t
		},
		// decelerating to zero velocity
		easeOutQuad: function(t) {
			return t * (2 - t)
		},
		// acceleration until halfway, then deceleration
		easeInOutQuad: function(t) {
			return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
		},
		// accelerating from zero velocity 
		easeInCubic: function(t) {
			return t * t * t
		},
		// decelerating to zero velocity 
		easeOutCubic: function(t) {
			return (--t) * t * t + 1
		},
		// acceleration until halfway, then deceleration 
		easeInOutCubic: function(t) {
			return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
		},
		// accelerating from zero velocity 
		easeInQuart: function(t) {
			return t * t * t * t
		},
		// decelerating to zero velocity 
		easeOutQuart: function(t) {
			return 1 - (--t) * t * t * t
		},
		// acceleration until halfway, then deceleration
		easeInOutQuart: function(t) {
			return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
		},
		// accelerating from zero velocity
		easeInQuint: function(t) {
			return t * t * t * t * t
		},
		// decelerating to zero velocity
		easeOutQuint: function(t) {
			return 1 + (--t) * t * t * t * t
		},
		// acceleration until halfway, then deceleration 
		easeInOutQuint: function(t) {
			return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
		}
	}

	$('[data-count]').each(function() {
		var duration = 2000;
		var interval = Math.floor(duration / 60);
		var steps = Math.ceil(duration / interval);
		var $target = $(this);
		var offset = $target.offset().top;
		var max = $target.data('count');
		$target.html('0');
		var started = false;

		var startCounter = function() {
		    if (started) return;
		    
		    started = true;
			var i = 0,
				handle;
			handle = window.setInterval(function() {
				$target.html(Math.round(max * EasingFunctions.easeOutCubic(i / steps)));
				i++;
				if (i == steps) {
					$target.html(max);
					window.clearInterval(handle);
				}
			}, interval);
		};

		viewport.observe('scroll', function() {
			if ((viewport.getScrollTop() + viewport.getHeight() / 2) > offset) {
				startCounter();
			}
		});
	});
});
/* End JS for preset "Counter" */

/* JS for preset "Typewriter" */
$(function() {
	$('.tw-instance').each(function() {
		typeWriter($(this))
	});
});

const typeWriter = function($twInstance) {
	const $target = $twInstance;
	const $tw_output = $('.tw-output', $target);
	let index = 0,
		isAdding = true
	let text = [];
	let current = 0;
	let animationLoop = 0;
	let writing_speed,
		deleting_speed,
		cursor_ticking,
		pause,
		pause_hover,
		loop,
		trigger,
		isHovering;

	// Wait for load
	const ready = function(callback) {
		var fn = function() {
			callback();
		};

		if (window.readyState !== 'loading') {
			fn();
			return;
		}
		document.addEventListener('DOMContentLoaded', fn);
	};

	// Save the texts
	$('.text-container .ed-element.ed-text', $target).text(function(index, currentcontent) {
		text[index] = currentcontent;
	});

	const typeWriterAnim = function() {
		const timeoutId = setTimeout(() => {
			if (String(timeoutId) !== $twInstance[0].dataset.timeoutId) return;
		
			if (isHovering && pause_hover) {
			    typeWriterAnim();
			    return;
			}
			
			//Stop animation when editing
			if ($('.text-container .ed-element.ed-text', $target).hasClass('wv-editing')) {
			    typeWriterAnim();
			    return;
			}
			
			if (text[current] !== undefined) {
				$tw_output[0].innerHTML = text[current].substring(0, index);
			}

			if (isAdding) {
				// adding text
				if ($tw_output[0].innerHTML.length == 0) {
					$tw_output.addClass("showAnim");
					$tw_output.removeClass("hideCursor");
					setTimeout(() => {
						index++;
					}, pause);
				} else {
					if (index > text[current].length) {
						// no more text to add
						isAdding = false;

						// pause before starting deletion
						$tw_output.addClass("showAnim");
						setTimeout(function() {
							typeWriterAnim();
						}, pause);
						return;
					} else {
						// increment index by 1
						index++;
						$tw_output.removeClass("showAnim");
					}
				}
			} else {
				// removing text
				if (index === 0) {
					// blink again
					$tw_output.addClass("showAnim");
					// no more text to remove
					isAdding = true;

					//Re-parsing settings (edit mode only)
					if (document.body.classList.contains('edit')) {
						handleSettingValues();
						reParseTexts();
					}

					// handle loop
					if (loop) {
						current = (current + 1) % text.length;
					} else {
						current = (current + 1);
						// keep looping on edit mode (just for show)
						if (document.body.classList.contains('edit') && current === text.length) {
							current = 0;
						}
					}
				} else {
					//keep last text visible (not on edit mode)
					if (!document.body.classList.contains('edit')) {
						if (loop === false && current === text.length - 1) {
							$tw_output.removeClass("showAnim");
							$tw_output.addClass("hideCursor");
							return;
						}
					}
					// decrement index by 1
					index--;
					$tw_output.removeClass("showAnim");
				}
			}
			typeWriterAnim();
		}, isAdding ? writing_speed : deleting_speed);
		$twInstance[0].dataset.timeoutId = timeoutId;
	}

	// Parse and handle the values from preset
	const handleSettingValues = function() {
		const values = window.getComputedStyle($target[0], ':before').content.slice(1, -1).split('-');
		let ms_pattern = /[ms]\D/;
		let parsedValues = [];

		values.forEach(value => {
			if (value === 'false' || value === "true") {
				parsedValues.push(JSON.parse(value));
			} else if (ms_pattern.test(value)) {
				parsedValues.push(parseFloat(value.replace('ms', '')))
			} else {
				parsedValues.push(parseFloat(value.replace('s', '')) * 1000)
			}
		});

		writing_speed = parsedValues[0];
		deleting_speed = parsedValues[1];
		cursor_ticking = parsedValues[2];
		pause = parsedValues[3];
		pause_hover = parsedValues[4];
		loop = parsedValues[5];

		// Handle mouse hover
		if (pause_hover) {
			$tw_output[0].addEventListener(('mouseenter'), function() {
				isHovering = true;
			});
			$tw_output[0].addEventListener(('mouseleave'), function() {
				isHovering = false;
			});

			// Necessary for "pause on hover" (on edit mode)
			$tw_output.addClass("pauseHover");
		} else {
			$tw_output.removeClass("pauseHover");
		}

	}

	const reParseTexts = function() {
		// Refresh text
		text = [];

		$('.text-container .ed-element.ed-text', $target).each(function(index, currentcontent) {
			text[index] = $(currentcontent).text();
		});
	}

	handleSettingValues();

	/**
	 * Get the trigger value
	 * We are using the fill property on an element to pass user's choices from CSS to JavaScript
	 * 
	 * @param {jQuery} $element
	 */
	const getTrigger = function($element) {
		let triggerValue = getComputedStyle($element[0]).fill;

		return triggerValue === 'rgb(0, 255, 0)' ?
			'scroll' :
			'load';
	};

	//Play animation on "scroll into element"
	const animationObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				animationLoop += 1;
				if (animationLoop <= 1) {
					typeWriterAnim();
				}
			}
		})
	}, {
		root: document.window,
		rootMargin: "0px",
	});

	//Start animation 
	ready(function() {

		//Initialize values if needed
		writing_speed = isNaN(writing_speed) ? 200 : writing_speed
		deleting_speed = isNaN(deleting_speed) ? 100 : deleting_speed
		cursor_ticking = isNaN(cursor_ticking) ? 200 : cursor_ticking
		pause = isNaN(pause) ? 500 : pause
		pause_hover === undefined ? pause_hover = false : pause_hover;
		loop === undefined ? loop = true : loop;

		trigger = getTrigger($tw_output);

		if (trigger === 'scroll') {
			if (!document.body.classList.contains('edit')) {
				animationObserver.observe($tw_output[0]);
			} else {
				typeWriterAnim();
			}
		}
		if (trigger === 'load') {
			typeWriterAnim();
		}
	});
};
/* End JS for preset "Typewriter" */

/* JS for preset "Language V2" */
$(function() {
	//Adds Flag data attr
	setTimeout(function() {
		$(".language-item").children('a').each(function() {
			//Check for potentially unfitting language codes as they might differentiate from flag codes
			function correctLangCode(source) {
				return source === "en" ? 'gb' :
				source === "km" ? "kh" :
				source === "ko" ? "kr" :
				source === "he" ? "il" :
				source === "ar" ? "ae" :
				source === "uk" ? "ua" :
				source === "el" ? "gr" :
				source === "sl" ? "si" :
				source === "ca" ? "es-ca" :
				source === "hi" ? "in" :
				source === "bn" ? "bd" :
				source === "pa" ? "in" :
				source === "ur" ? "pk" :
				source === "zh" ? "cn" : source;
			}
			$(this).css("backgroundImage", "url(/bundles/flag-icon-css/flags/4x3/" + correctLangCode($(this).attr("data-lang")) + ".svg)");
		});
	}, 1000);
	
	//Prevents select trigger from working within the CMS
	if (document.body.classList.contains('edit') || document.body.classList.contains('preview')) {
		return;
	}
	
	// Click event to open cusom select box  - quotes is being used as an identifier
	if ($(".language-icon").css('quotes') == '"“" "”"') {
		$(".language-icon").on("click", function() {
			if (!$(".language-icon").hasClass("active")) {
				$(".language-item").slideDown({
					start: function() {
						$(this).css({
							display: "flex"
						});
					}
				});
				$(".language-icon").addClass("active");
			} else if ($(".language-icon").hasClass("active")) {
				$(".language-icon").removeClass("active");
				$(".language-item").slideUp();
			}
		});
	}
});
/* End JS for preset "Language V2" */

/* JS for preset "Collection Filter Buttons" */
(function() {
    function extractQuery(hash) {
        // catch hash with e.g 'Foo & Bar'
    	if (hash.includes(' &')) {
    		hash = (hash || '').replace(/[&]/g, '%26');
    	}
        return (hash || '').replace(/^#?!?/, '');
    }
    function mergeQueries(a, b) {
    	a = new URLSearchParams(extractQuery(a));
    	for (var [key, value] of new URLSearchParams(extractQuery(b))) {
    	    value == '' ? a.delete(key) : a.set(key, value);
    	}
    	return a.toString().replace(/[+]/g, '%20');
    }
    function containsQuery(haystack, needle) {
        haystack = new URLSearchParams(extractQuery(haystack));
    	for (var [key, value] of new URLSearchParams(extractQuery(needle))) {
    	    if ((haystack.get(key)||'') !== value) {
    	        return false;
    	    }
    	}
    	return true;
    }
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.filter-button a')) {
                return;
            }
            
            location.hash = '!' + mergeQueries(location.hash, e.target.hash);
			e.preventDefault();
        });
    	var updateFilterButtonState = function() {
    	    var filterButtons = document.querySelectorAll('.filter-button a');
    	    filterButtons.forEach(function(filterButton) {
    	        filterButton.classList.remove('active');
    	        if (containsQuery(location.hash, filterButton.hash)) {
    	            filterButton.classList.add('active');
    	        }
    	    });
    	};
    	window.addEventListener('popstate', updateFilterButtonState);
    	setInterval(function() {
    	    updateFilterButtonState();
    	}, 1000);
    });
})();
/* End JS for preset "Collection Filter Buttons" */