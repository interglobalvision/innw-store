/* jshint browser: true, devel: true, indent: 2, curly: true, eqeqeq: true, futurehostile: true, latedef: true, undef: true, unused: true */
/* global jQuery, $, document, Site, Modernizr */

Site = {
  mobileThreshold: 601,
  init: function() {
    var _this = this;

    $(window).resize(function(){
      _this.onResize();
    });

    if ($('body').hasClass('template-product')) {
      _this.Product.init();
    }

  },

  onResize: function() {
    var _this = this;

    if ($('#product-gallery').length) {
      _this.Product.setGalleryWidth();
    }
  },

  fixWidows: function() {
    // utility class mainly for use on headines to avoid widows [single words on a new line]
    $('.js-fix-widows').each(function(){
      var string = $(this).html();
      string = string.replace(/ ([^ ]*)$/,'&nbsp;$1');
      $(this).html(string);
    });
  },


};

Site.Product = {
  init: function() {
    var _this = this;

    if ($('#product-gallery').length) {
      _this.setGalleryWidth();
    }

    if ($('#related-products').length) {
      _this.pickRelated();
    }
  },

  setGalleryWidth: function() {
    var galleryWidth = 0;

    $('.product-gallery-item').each(function() {
      galleryWidth += $(this).width();
    });

    $('#product-gallery-row').width(galleryWidth);
  },

  pickRelated: function() {
    $('.related-products-item').pick(4);

    $('#related-products').removeClass('u-hidden');
  },
}

jQuery(document).ready(function () {
  'use strict';

  Site.init();

});
