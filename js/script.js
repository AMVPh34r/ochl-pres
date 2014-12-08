// Constructor
var app = app || {};

// Variables
app.videoDone = false;
app.slideColors = ['#03899C', '#00B945', '#FF7A00', '#1144AA', 
				   '#FF9700', '#00B945', '#03899C', '#1144AA'];
app.currentSlide = 1;

// Functions
app.toSlide = function(index) {
	// If trying to access a slide that doesn't exist, do nothing
	if ((index < 1) || (index > $('.slide').length)) {
		return;
	}
	// For each slide, show it if it is behind the slide to move to
	// Otherwise hide it
	$('.slide').each(function() {
		var slide = $(this);
		if (slide.attr('data-slide') <= index) {
			slide.addClass('slide-show');
		} else {
			slide.removeClass('slide-show');
		}
	});
	app.currentSlide = index;
}

app.nextSlide = function() {
	app.toSlide(app.currentSlide + 1);
}

app.prevSlide = function() {
	app.toSlide(app.currentSlide - 1);
}

app.setSlideBgs = function(colors) {
	var slides = $('.slide');
	for (i=0; i<slides.length; i++) {
		var slide = $(slides[i])
		if (slide.attr('data-bg') !== undefined) {
			slide.css('background-color', slide.attr('data-bg'));
		} else {
			slide.css('background-color', colors[i]);
		}
	}
}

app.run = function() {
	// Immediately pause all but first video
	$('.mainvideo').not('.mainvideo-first').get(0).pause();

	// Set slide background colors
	app.setSlideBgs(app.slideColors);

	$('.mainvideo').on('ended click', function() {
		// Skip to the next video if it exists when the video is finished or clicked
		var vid = $(this);

		if (vid.attr('data-next') !== undefined) {
			vid.hide();
			$(vid.attr('data-next')).show().get(0).play();
		} else {
			app.videoDone = true;
		}
	});

	$(document).on('click', '.slide', function() {
		// When a slide is clicked, move to the next one if it exists
		var slide = $(this);
		var nextSlide = slide.attr('data-next');

		if ((app.videoDone === true) && (nextSlide !== undefined)) {
			var nextIndex = parseInt(nextSlide.substring(nextSlide.indexOf('-')+1));
			app.toSlide(nextIndex);
		}
	}).on('keydown', function(e) {
		// When a key is pressed, perform a specific action
		switch(e.keyCode) {
			case 35:
				// End key
				app.toSlide($('.slide').length);
				break;
			case 36:
				// Home key
				app.toSlide(1);
				break;
			case 38:
				// Up arrow
				app.prevSlide();
				break;
			case 40:
				// Down arrow
				app.nextSlide();
				break;
		}
	});

};

$(document).ready(app.run);