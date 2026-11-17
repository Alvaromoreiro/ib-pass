dFrontJs.ibe_uploadfile = function () {
	//Jquery ui upload
	var init = function () {
		var file = $('[data-file]');
		var files;

		if (file) {
			file.each(function () {
				var $thisItem = $(this);
				var acceptAttr = $(this).attr('accept');
				if (!$thisItem.hasClass('uploadInit')) {
					$thisItem.addClass('uploadInit');
					$thisItem.on('change', function (event) {
						var $this = $(this),
							$parent = $this.parents('.ibe-upload'),
							$list = $parent.find('[data-fileList]'),
							validatedFiles = $this.data('validatedFiles') !== undefined ? $this.data('validatedFiles') : [],
							validatedNames = $this.data('validatedNames') !== undefined ? $this.data('validatedNames') : [],
							numFiles = $this.data('numfiles') !== undefined ? $this.data('numfiles') : 3,
							sizeTotal = $this.data('sizeTotal') !== undefined ? $this.data('sizeTotal') : 0.0;

						files = event.originalEvent.target.files;
						$(files).each(function (i, thisItem) {
							var info, name, size, type, validImageTypes, validTypes, attributeValue, index, sum;
							$parent.find('[data-alert]').not('[data-alert="required"]').addClass('hidden');
							if (validatedFiles.length < numFiles) {
								info = $this[0].files[i];
								name = info.name;
								size = ((info.size) / 1000000).toPrecision(2);
								type = info.type;
								validImageTypes = ['image/gif', 'image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];
								validTypes = [];
								attributeValue = acceptAttr.split(','); //[.jpg,.png,.xls...]
								for (index = 0; index < attributeValue.length; index++) {
									switch (attributeValue[index]) {
										case '.gif':
											validTypes.push(validImageTypes[0]);
											break;
										case '.jpeg':
											validTypes.push(validImageTypes[1]);
											break;
										case '.jpg':
											validTypes.push(validImageTypes[1]);
											break;
										case '.png':
											validTypes.push(validImageTypes[3]);
											break;
										case '.pdf':
											validTypes.push(validImageTypes[4]);
											break;
										case '.doc':
											validTypes.push(validImageTypes[5]);
											break;
										case '.docx':
											validTypes.push(validImageTypes[6]);
											break;
										case '.xlsx':
											validTypes.push(validImageTypes[7]);
											break;
										case '.xls':
											validTypes.push(validImageTypes[8]);
											break;
									}
								}

								if ($.inArray(type, validTypes) >= 0) {

									if ($.inArray(name, validatedNames) < 0) {
										sum = sizeTotal + parseFloat(size);
										if (sum < 5) {
											$list.append('<li class="ibe-list--files__item"> <p> <span class="ibe-list--files__text">' + name + '</span><span class="ibe-list--files__text ibe-list--files__text--grey">(' + size + 'MB' + ')</span></p> <a href="#" title="Eliminar" class="icon-cerrar ibe-list--files__link" data-fileClose>Eliminar</a></li>')
											validatedFiles.push(thisItem);
											validatedNames.push(name);// Simplest case
											sizeTotal += parseFloat(size);
											if (validatedFiles.length > 0) {
												$this.closest('.ibe_form__group').removeClass('ibe_form__group--error');
												$this.closest('.ibe_form__group').find('[data-validate="exist"]').addClass('hidden');
											} else {
												$this.closest('.ibe_form__group').addClass('ibe_form__group--error');
												$this.closest('.ibe_form__group').find('[data-validate="exist"]').removeClass('hidden');
											}
										} else {
											$list.parent().find('[data-alert="size"]').removeClass('hidden');
										}
									} else {
										$list.parent().find('[data-alert="same"]').removeClass('hidden');
									}
								} else {
									$list.parent().find('[data-alert="type"]').removeClass('hidden');
								}

							} else {
								$list.parent().find('[data-alert="files"]').removeClass('hidden');
							}
						});

						//Remove item List
						$('[data-fileClose]').click(function () {
							var $parent = $(this).parents('.ibe-upload');
							var name, $thisElement, positionItem, positionItem2;
							$(this).parents('[data-fileList]').parent().find('[data-alert="same"]').addClass('hidden');
							$(this).parents('[data-fileList]').parent().find('[data-alert="files"]').addClass('hidden');

							name = $(this).parent().find('.ibe-list--files__text').first().text();
							$thisElement = $(this).parent();
							$(validatedFiles).each(function (i, file) {

								if (file.name === name) {
									positionItem = validatedFiles.indexOf(file);
									positionItem2 = validatedNames.indexOf(name);
									validatedFiles.splice(positionItem, 1); // Simplest case
									validatedNames.splice(positionItem2, 1); // Simplest case
									$thisElement.remove();
									sizeTotal = sizeTotal - parseFloat((file.size / 1000000).toPrecision(2));
									$this.data('sizeTotal', $this.data('sizeTotal') - parseFloat((file.size / 1000000).toPrecision(2)));
								}

								if (validatedFiles.length > 0) {
									$parent.find('.ibe_form__group').removeClass('ibe_form__group--error');
									$parent.find('.ibe_form__group [data-validate="exist"]').addClass('hidden');
								} else {
									$parent.find('.ibe_form__group').addClass('ibe_form__group--error');
									$parent.find('.ibe_form__group [data-validate="exist"]').removeClass('hidden');
								}
							});
						});
						//Empty val input
						$(this).val('');

						$this.data('validatedFiles', validatedFiles);
						$this.data('validatedNames', validatedNames);
						$this.data('sizeTotal', sizeTotal);
					});
				}


			})
		}
	};
	return {
		'init': init
	};
}(jQuery);
