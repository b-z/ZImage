/**
 * @author Zhou Bowei
 */

var ZImage = {
	img: null,
	canvas: null,
	ctx: null,
	width: null,
	height: null,
	imgr: [],
	imgg: [],
	imgb: [],
	imga: [],
	imgv: []
};

/****************************************************************
 * Base Functions
 */

ZImage.loadImage = function(image) {
	this.img = image;
	this.width = image.width;
	this.height = image.height;
	// this.imgrgba = [];
	this.imgr = [];
	this.imgg = [];
	this.imgb = [];
	this.imga = [];
	for (var i = 0; i < this.height; i++) {
		for (var j = 0; j < this.width; j++) {
			var c = this.getPixelRGB(this.img.data, j, i);
			this.imgr.push(c.r);
			this.imgg.push(c.g);
			this.imgb.push(c.b);
			this.imga.push(c.a);
			this.imgv.push(c.r * 0.3 + c.g * 0.59 + c.b * 0.11);
		}
	}
}

ZImage.loadContext = function(canv, context) {
	this.canvas = canv;
	this.ctx = context;
}

ZImage.getImageFromCanvas = function() {
	this.img = this.ctx.getImageData(0, 0, this.width, this.height);
}

ZImage.putImageToCanvas = function() {
	this.img.data = [];
	for (var i = 0; i < this.imgr.length; i++) {
		this.img.data[i * 4] = this.imgr[i];
		this.img.data[i * 4 + 1] = this.imgg[i];
		this.img.data[i * 4 + 2] = this.imgb[i];
		this.img.data[i * 4 + 3] = this.imga[i];
	}
	this.ctx.putImageData(this.img, 0, 0);
}

ZImage.save = function(type) {
	if (type == undefined) {
		type = 'image/png';
	}
	var imgsrc = this.canvas.toDataURL(type).replace(type, "image/octet-stream");
	var img = new Image();
	img.src = imgsrc;
	window.location.href = imgsrc;
}

ZImage.getPixelRGB = function(dataArray, x, y) {
	if (x < 0) return this.getPixel(dataArray, 0, y);
	if (y < 0) return this.getPixel(dataArray, x, 0);
	if (x >= this.width) return this.getPixel(dataArray, this.width - 1, y);
	if (y >= this.height) return this.getPixel(dataArray, x, this.height - 1);
	return {
		r: dataArray[y * this.width * 4 + x * 4],
		g: dataArray[y * this.width * 4 + x * 4 + 1],
		b: dataArray[y * this.width * 4 + x * 4 + 2],
		a: dataArray[y * this.width * 4 + x * 4 + 3]
	}
}

ZImage.getPixelSingle = function(dataArray, x, y) {
	if (x < 0) return this.getPixelSingle(dataArray, 0, y);
	if (y < 0) return this.getPixelSingle(dataArray, x, 0);
	if (x >= this.width) return this.getPixelSingle(dataArray, this.width - 1, y);
	if (y >= this.height) return this.getPixelSingle(dataArray, x, this.height - 1);
	return dataArray[y * this.width + x];
}

/****************************************************************
 * Fourier Transform
 */
//
// ZImage.fastFourierTransformOneDimension = function(dataArray) {
// 	this.mul = function(a, b) {
// 		if (typeof(a) !== 'object') {
// 			a = {
// 				real: a,
// 				imag: 0
// 			}
// 		}
// 		if (typeof(b) !== 'object') {
// 			b = {
// 				real: b,
// 				imag: 0
// 			}
// 		}
// 		return {
// 			real: a.real * b.real - a.imag * b.imag,
// 			imag: a.real * b.imag + a.imag * b.real
// 		};
// 	};
// 	this.add = function(a, b) {
// 		if (typeof(a) !== 'object') {
// 			a = {
// 				real: a,
// 				imag: 0
// 			}
// 		}
// 		if (typeof(b) !== 'object') {
// 			b = {
// 				real: b,
// 				imag: 0
// 			}
// 		}
// 		return {
// 			real: a.real + b.real,
// 			imag: a.imag + b.imag
// 		};
// 	};
// 	this.sub = function(a, b) {
// 		if (typeof(a) !== 'object') {
// 			a = {
// 				real: a,
// 				imag: 0
// 			}
// 		}
// 		if (typeof(b) !== 'object') {
// 			b = {
// 				real: b,
// 				imag: 0
// 			}
// 		}
// 		return {
// 			real: a.real - b.real,
// 			imag: a.imag - b.imag
// 		};
// 	};
// 	this.sort = function(data, r) {
// 		if (data.length <= 2) {
// 			return data;
// 		}
// 		var index = [0, 1];
// 		for (var i = 0; i < r - 1; i++) {
// 			var tempIndex = [];
// 			for (var j = 0; j < index.length; j++) {
// 				tempIndex[j] = index[j] * 2;
// 				tempIndex[j + index.length] = index[j] * 2 + 1;
// 			}
// 			index = tempIndex;
// 		}
// 		var datatemp = [];
// 		for (var i = 0; i < index.length; i++) {
// 			datatemp.push(data[index[i]]);
// 		}
// 		return datatemp;
// 	};
// 	var dataLen = dataArray.length;
// 	var r = 1;
// 	var i = 1;
// 	while (i * 2 < dataLen) {
// 		i *= 2;
// 		r++;
// 	}
// 	var count = 1 << r;
// 	for (var i = dataLen; i < count; i++) {
// 		dataArray[i] = 0;
// 	}
// 	dataArray = this.sort(dataArray, r);
// 	var w = [];
// 	for (var i = 0; i < count / 2; i++) {
// 		var angle = -i * Math.PI * 2 / count;
// 		w.push({
// 			real: Math.cos(angle),
// 			imag: Math.sin(angle)
// 		});
// 	}
// 	for (var i = 0; i < r; i++) {
// 		var group = 1 << (r - 1 - i);
// 		var distance = 1 << i;
// 		var unit = 1 << i;
// 		for (var j = 0; j < group; j++) {
// 			var step = 2 * distance * j;
// 			for (var k = 0; k < unit; k++) {
// 				var temp = this.mul(dataArray[step + k + distance], w[count * k / 2 / distance]);
// 				dataArray[step + k + distance] = this.sub(dataArray[step + k], temp);
// 				dataArray[step + k] = this.add(dataArray[step + k], temp);
// 			}
// 		}
// 	}
// 	return dataArray;
// }
//
// ZImage.fastFourierTransform = function(dataArray) {
// 	var width = this.width;
// 	var height = this.height;
// 	var r = 1;
// 	var i = 1;
// 	while (i * 2 < width) {
// 		i *= 2;
// 		r++;
// 	}
// 	var width2 = 1 << r;
// 	var r = 1;
// 	var i = 1;
// 	while (i * 2 < height) {
// 		i *= 2;
// 		r++;
// 	}
// 	var height2 = 1 << r;
// 	var dataArrayTemp = [];
// 	for (var i = 0; i < height2; i++) {
// 		for (var j = 0; j < width2; j++) {
// 			if (i >= height || j >= width) {
// 				dataArrayTemp.push(0);
// 			} else {
// 				dataArrayTemp.push(dataArray[i * width + j]);
// 			}
// 		}
// 	}
// 	dataArray = dataArrayTemp;
// 	width = width2;
// 	height = height2;
// 	var dataTemp = [];
// 	var dataArray2 = [];
// 	for (var i = 0; i < height; i++) {
// 		dataTemp = [];
// 		for (var j = 0; j < width; j++) {
// 			dataTemp.push(dataArray[i * width + j]);
// 		}
// 		dataTemp = this.fastFourierTransformOneDimension(dataTemp);
// 		for (var j = 0; j < width; j++) {
// 			dataArray2.push(dataTemp[j]);
// 		}
// 	}
// 	dataArray = dataArray2;
// 	dataArray2 = [];
// 	for (var i = 0; i < width; i++) {
// 		var dataTemp = [];
// 		for (var j = 0; j < height; j++) {
// 			dataTemp.push(dataArray[j * width + i]);
// 		}
// 		dataTemp = this.fastFourierTransformOneDimension(dataTemp);
// 		for (var j = 0; j < height; j++) {
// 			dataArray2.push(dataTemp[j]);
// 		}
// 	}
// 	dataArray = [];
// 	for (var i = 0; i < height; i++) {
// 		for (var j = 0; j < width; j++) {
// 			var t = dataArray2[i * width + j];
// 			dataArray[j * height + i] = t;
// 		}
// 	}
// 	return dataArray;
// }
//
// ZImage.fftShow = function(dataArray) {
// 	var min = 1e10;
// 	var max = -1e10;
// 	var dst=[];
// 	for (var i = 0; i < dataArray.length; i++) {
// 		var t = dataArray[i];
// 		var s = Math.log(1 + Math.sqrt(Math.pow(t.real, 2), Math.pow(t.imag, 2)));
// 		if (s > max) max = s;
// 		if (s < min) min = s;
// 		dst.push(s);
// 	}
// 	for (var i = 0; i < dataArray.length; i++) {
// 		dst[i] = (dst[i] - min) / (max - min);
// 	}
// 	return dst;
// }

/****************************************************************
 * Blur
 */

ZImage.medianBlurSingle = function(filterWidth, filterHeight, dataArray) {
	var width = this.width;
	var height = this.height;
	var temp = [];
	for (var i = 0; i < dataArray.length; i++) {
		temp.push(dataArray[i]);
	}
	var count = 0;
	for (var x = (filterWidth - 1) / 2; x < width - (filterWidth - 1) / 2; x++) {
		for (var y = (filterHeight - 1) / 2; y < width - (filterHeight - 1) / 2; y++) {
			var tempArray = [];
			for (var i = -(filterWidth - 1) / 2; i <= (filterWidth - 1) / 2; i++) {
				for (var j = -(filterHeight - 1) / 2; j <= (filterHeight - 1) / 2; j++) {
					// [(j + y) * width + i + x]
					tempArray.push(temp[(j + y) * width + i + x]);
					// count++;
				}
			}
			do {
				var loop = 0;
				for (var i = 0; i < tempArray.length - 1; i++) {
					if (tempArray[i] > tempArray[i + 1]) {
						var tempChange = tempArray[i];
						tempArray[i] = tempArray[i + 1];
						tempArray[i + 1] = tempChange;
						loop = 1;
						// count++;
					}
				}
			} while (loop);
			dataArray[y * width + x] = tempArray[Math.round(tempArray.length / 2)];
		}
	}
	// console.log(count);
	return dataArray;
}

ZImage.convolute = function(mask, dataArray, center) {
	var len = dataArray.length;
	var res = [];
	for (var i = 0; i < len; i++) {
		res.push(0);
	}
	for (var i = 0; i < this.width; i++) {
		for (var j = 0; j < this.height; j++) {
			for (var my = 0; my < mask.length; my++) {
				for (var mx = 0; mx < mask[my].length; mx++) {
					// var dx=mx-center.x;
					// var dy=my-center.y;
					res[j * this.width + i] += mask[my][mx] * this.getPixelSingle(dataArray, i + mx - center.x, j + my - center.y);
				}
			}
		}
	}
	return res;
}

ZImage.generateGussianBlurKernel = function(size, sigma) {
	var s = 2 * size - 1;
	var center = {
		x: size - 1,
		y: size - 1
	};
	var mask = [];
	for (var i = 0; i < s; i++) {
		var tmp = [];
		for (var j = 0; j < s; j++) {
			var r2 = Math.pow(i - center.x, 2) + Math.pow(j - center.y, 2);
			tmp.push(Math.exp(-r2 / 2 / Math.pow(sigma, 2)) / 2 / Math.PI / Math.pow(sigma, 2));
		}
		mask.push(tmp);
	}
	return {
		mask: mask,
		center: center
	};
}

// mask=[[1/9,1/9,1/9],[1/9,1/9,1/9],[1/9,1/9,1/9]];
// ZImage.imgr=ZImage.convolute(mask,ZImage.imgr,{x:1,y:1});
