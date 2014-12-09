// Constructor
var app = app || {};

// Variables
app.canChangeSlides = false;
app.slideColors = ['#03899C', '#FF7A00', '#222222', '#1144AA', 
				   '#FF9700', '#00B945', '#03899C', '#1144AA'];
app.windowHash = "";
app.currentSlide = 1;

// Functions
app.toSlide = function(index) {
	index = parseInt(index);
	// If index is not a number, or if trying to access a slide that doesn't exist, do nothing
	if ((isNaN(index)) || (index < 1) || (index > $('.slide').length)) {
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
	// Modify URL hash
	if (index > 1) {
		app.hash = index;
		window.location.hash = index;
	} else {
		app.hash = "";
		window.location.hash = "";
	}
	app.currentSlide = index;
	app.canChangeSlides = true;	// Assuming a slide change was forced, allow future ones
};

app.nextSlide = function() {
	app.toSlide(app.currentSlide + 1);
};

app.prevSlide = function() {
	app.toSlide(app.currentSlide - 1);
};

app.checkHash = function() {
	// If the URL hash points to a slide, go to it
	app.hash = window.location.hash.substring(1);
	if ((app.hash === "") && (app.currentSlide != 1)) {
		app.toSlide(1);
	} else if (!isNaN(app.hash)) {
		app.toSlide(app.hash);
	} else {
		window.location.hash = "";
	}
	// If the hash is empty, remove the number sign
	if (app.hash === "") {
		history.pushState("", document.title, window.location.pathname + window.location.search);
	}
};

app.setSlideBgs = function(colors) {
	var slides = $('.slide');
	var ci = 0;
	for (i=0; i<slides.length; i++) {
		var slide = $(slides[i]);
		if (slide.attr('data-bg') !== undefined) {
			slide.css('background', slide.attr('data-bg'));
		} else {
			slide.css('background', colors[ci]);
		}
		ci += 1;
		if (ci >= colors.length) {
			ci = 0;
		}
	}
};

app.gallery = function() {
	var current = ($('.img-slideshow a.show')?  $('.img-slideshow a.show') : $('.img-slideshow a:first'));
	var next = ((current.next().length) ? ((current.next().hasClass('caption'))? $('.img-slideshow a:first') :current.next()) : $('.img-slideshow a:first'));	
	var caption = next.find('img').attr('rel');	
	
	//Set the fade in effect for the next image, show class has higher z-index
	next.css({opacity: 0.0}).addClass('show').animate({opacity: 1.0}, 1000);
	current.animate({opacity: 0.0}, 1000).removeClass('show');
	
	$('.img-slideshow .caption').animate({opacity: 0.0}, { queue:false, duration:0 }).animate({height: '1px'}, { queue:true, duration:300 });	
	$('.img-slideshow .caption').animate({opacity: 0.7},100 ).animate({height: '100px'},500 );
	$('.img-slideshow .content').html(caption);
}

app.run = function() {
	// Immediately pause all but first video
	if ($('video.mainvideo').not('.mainvideo-first').length !== 0) {
		$('video.mainvideo').not('.mainvideo-first').get(0).pause();
	}

	// Check if the URL hash is requesting a slide, and set up a listener
	app.checkHash();
	$(window).on('hashchange', app.checkHash);

	// Set slide background colors
	app.setSlideBgs(app.slideColors);

	// Set up image slideshows
	$('.img-slideshow a').css({opacity: 0.0});
	$('.img-slideshow a:first').css({opacity: 1.0});
	$('.img-slideshow .caption').css({width: $('.img-slideshow a').find('img').css('width')});
	$('.img-slideshow .content').html($('.img-slideshow a:first').find('img').attr('rel')).animate({opacity: 0.7}, 400);
	setInterval(app.gallery,6000);

	$('.mainvideo').on('ended click', function() {
		// Skip to the next video if it exists when the video is finished or clicked
		var vid = $(this);

		if (vid.attr('data-next') !== undefined) {
			vid.hide();
			$(vid.attr('data-next')).show().get(0).play();
		} else {
			app.canChangeSlides = true;
		}
	});

	$(document).on('click', '.slide', function() {
		// When a slide is clicked, move to the next one if it exists
		var slide = $(this);
		var nextSlide = slide.attr('data-next');

		if ((app.canChangeSlides === true) && (nextSlide !== undefined)) {
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
			case 37:
				// Left arrow
			case 38:
				// Up arrow
				app.prevSlide();
				break;
			case 39:
				// Right arrow
			case 40:
				// Down arrow
				app.nextSlide();
				break;
			case 67:
				// C key
				if ($('.slide').css('cursor') == "pointer") {
					$('.slide').css('cursor', 'none');
				} else {
					$('.slide').css('cursor', '');
				}
				break;
		}
	});

};

$(document).ready(app.run);