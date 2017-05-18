jQuery(function() {
	initPopups();
	initModals();
});

function initPopups() {
	var win = jQuery(window);
	var activeClass = 'popup-active';
	var openedClass = 'opened';
	var content = jQuery('.content');
	var contentBlock = jQuery('.content-holder');

	jQuery('.popup-opener').each(function() {
		var opener = jQuery(this);
		var target = jQuery(opener.attr('href'));
		var timer = null;

		opener.on('click', function(e) {
			e.preventDefault();
			if (target.hasClass(activeClass)) {
				target.removeClass(activeClass);
				opener.removeClass(openedClass);

				contentBlock.css({
					'marginBottom': 0
				});
				content.css({
					'marginBottom': 0
				});
			} else {
				target.addClass(activeClass);
				opener.addClass(openedClass);
				refreshIndents();
			}
		});

		function refreshIndents() {
			contentBlock.css({
				'marginBottom': -1 * calcHeight(target)
			});
			content.css({
				'marginBottom': calcHeight(target)
			});
		}

		win.on('resize orientationchange', function() {
			if (target.hasClass(activeClass)) {
				clearTimeout(timer);
				timer = setTimeout(function() {
					refreshIndents();
				}, 100);
			}
		})
	});

	function calcHeight(block) {
		var blockHeight = block.innerHeight();
		return blockHeight;
	}
}

function initModals() {
	var activeClass = 'modal-active';
	var openedClass = 'opened';

	jQuery('.modal-opener').each(function() {
		var opener = jQuery(this);
		var target = jQuery(opener.attr('href'));

		opener.on('click', function(e) {
			e.preventDefault();
			target.toggleClass(activeClass);
			opener.toggleClass(openedClass);
		});
	});
}