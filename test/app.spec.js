/* global browser, element, by */

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiSmoothie = require('chai-smoothie');

chai.use(chaiAsPromised);
chai.use(chaiSmoothie);
const expect = chai.expect;

describe('e2e first test', function() {
	browser.waitForAngularEnabled(false);

	it('should enable run overly complex', function(done) {
		// this.timeout(10000);
		try {
			browser.get('http://localhost:8000/');
			expect({foo: 'bar'}).to.have.property('foo');

			const runButton = element(by.buttonText('Run'));

			expect(runButton).to.be.displayed;
			expect(runButton).not.to.be.enabled;

			element(by.id('votes')).sendKeys('a\n\t');

			expect(runButton).to.be.enabled;
			done();

		} catch (error) {
			done(error);
		}
	});

	it('should enable run', function() {
		browser.get('http://localhost:8000/');

		const runButton = element(by.buttonText('Run'));

		expect(runButton).to.be.displayed;
		expect(runButton).not.to.be.enabled;

		element(by.id('votes')).sendKeys('a\n\t');

		expect(runButton).to.be.enabled;
	});

	it('should handle a,a,b', function() {
		browser.get('http://localhost:8000/');
		const runButton = element(by.buttonText('Run'));
		element(by.id('votes')).sendKeys('a\na\nb\nb\t');
		runButton.click();

		const lastTableRow = element.all(by.css('tbody td')).get(-2);
		expect(lastTableRow.getText()).to.eventually.equal('2');
	});
});
