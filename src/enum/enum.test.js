import { JoinSite, Answer } from '.';

describe('enum', function() {
	describe('JoinSite', function() {
		it('static mehtod keys should return array', function() {
			const keys = JoinSite.keys();
			should(keys).be.an.Array();
			should(keys).have.length(5);
		});

		it('static mehtod values should return array', function() {
			const values = JoinSite.values();
			should(values).be.an.Array();
			should(values).have.length(5);
		});

		it('instance method enumValueOf should return object', function() {
			const enumValue = JoinSite.enumValueOf('naver');
			should(enumValue).be.an.Object();
			should(enumValue).have.keys('name', 'value', 'alias');
		});
	});
});
