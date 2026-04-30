/*
	Paradigm Shift by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body');

	// Breakpoints.
		breakpoints({
			default:   ['1681px',   null       ],
			xlarge:    ['1281px',   '1680px'   ],
			large:     ['981px',    '1280px'   ],
			medium:    ['737px',    '980px'    ],
			small:     ['481px',    '736px'    ],
			xsmall:    ['361px',    '480px'    ],
			xxsmall:   [null,       '360px'    ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Hack: Enable IE workarounds.
		if (browser.name == 'ie')
			$body.addClass('is-ie');

	// Mobile?
		if (browser.mobile)
			$body.addClass('is-mobile');

	// Scrolly.
		$('.scrolly')
			.scrolly({
				offset: 100,
				speed: 900,
				easing: 'swing'
			});

	// Polyfill: Object fit.
		if (!browser.canUse('object-fit')) {

			$('.image[data-position]').each(function() {

				var $this = $(this),
					$img = $this.children('img');

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', $this.data('position'))
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

			$('.gallery > a').each(function() {

				var $this = $(this),
					$img = $this.children('img'),
					href = $this.attr('href');

				// Video item? Replace <a> with an inline <video>.
					if (href && href.match(/\.(mp4|webm|ogg|mov)$/i)) {
						var $tile = $('<div class="video-tile"><video loop muted controls playsinline preload="metadata"></video></div>')
							.addClass($this.attr('class')),
							$video = $tile.find('video');

						$video
							.attr('src', href)
							.attr('poster', $img.attr('src'))
							.attr('controlslist', 'nodownload noplaybackrate noremoteplayback')
							.attr('disablepictureinpicture', '')
							.attr('disableremoteplayback', '')
							.prop('muted', true);

						$tile.insertAfter($this);

						$this.remove();
						return;
					}

				// Apply img as background.
					$this
						.css('background-image', 'url("' + $img.attr('src') + '")')
						.css('background-position', 'center')
						.css('background-size', 'cover')
						.css('background-repeat', 'no-repeat');

				// Hide img.
					$img
						.css('opacity', '0');

			});

		}

	// Convert video links to inline players (all browsers).
		$('.gallery > a').each(function() {

			var $this = $(this),
				$img = $this.children('img'),
				href = $this.attr('href');

			if (!(href && href.match(/\.(mp4|webm|ogg|mov)$/i)))
				return;

			var $tile = $('<div class="video-tile"><video loop muted controls playsinline preload="metadata"></video></div>')
				.addClass($this.attr('class')),
				$video = $tile.find('video');

			$video
				.attr('src', href)
				.attr('poster', $img.attr('src'))
				.attr('controlslist', 'nodownload noplaybackrate noremoteplayback')
				.attr('disablepictureinpicture', '')
				.attr('disableremoteplayback', '')
				.prop('muted', true);

			$tile.insertAfter($this);

			$this.remove();

		});

		$('.gallery').on('contextmenu', 'video', function(event) {
			event.preventDefault();
		});

		$('.gallery').on('volumechange', 'video', function() {
			this.muted = true;
			this.volume = 0;
		});

	// Gallery.
		$('.gallery')
			.on('click', 'a', function(event) {

				var $a = $(this),
					$gallery = $a.parents('.gallery'),
					$modal = $gallery.children('.modal'),
					$inner = $modal.find('.inner'),
					href = $a.attr('href');

				// Not a supported media type? Bail.
					if (!href.match(/\.(jpg|gif|png)$/i))
						return;

				// Prevent default.
					event.preventDefault();
					event.stopPropagation();

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Lock.
					$modal[0]._locked = true;

				// Clear previous media.
					$inner.empty();

				// Build image element.
					var $img = $('<img src="" />')
						.attr('src', href)
						.on('load', function() {
							setTimeout(function() {
								if (!$modal.hasClass('visible')) return;
								$modal.addClass('loaded');
							}, 275);
						});

					$inner.append($img);

				// Set visible.
					$modal.addClass('visible');
					$modal.focus();

					setTimeout(function() {
						$modal[0]._locked = false;
					}, 600);

			})
			.on('click', '.modal', function(event) {

				var $modal = $(this),
					$inner = $modal.find('.inner');

				// Locked? Bail.
					if ($modal[0]._locked)
						return;

				// Already hidden? Bail.
					if (!$modal.hasClass('visible'))
						return;

				// Stop propagation.
					event.stopPropagation();

				// Lock.
					$modal[0]._locked = true;

				// Pause video if present.
					var video = $inner.find('video')[0];
					if (video) video.pause();

				// Clear visible, loaded.
					$modal.removeClass('loaded');

				// Delay.
					setTimeout(function() {

						$modal.removeClass('visible');

						setTimeout(function() {

							// Clear media.
								$inner.empty();

							// Unlock.
								$modal[0]._locked = false;

							// Focus.
								$body.focus();

						}, 475);

					}, 125);

			})
			.on('keypress', '.modal', function(event) {

				var $modal = $(this);

				// Escape? Hide modal.
					if (event.keyCode == 27)
						$modal.trigger('click');

			})
			.on('mouseup mousedown mousemove', '.modal', function(event) {

				// Stop propagation.
					event.stopPropagation();

			})
			.prepend('<div class="modal" tabIndex="-1"><div class="inner"></div></div>');

})(jQuery);