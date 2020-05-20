import { agent } from 'supertest';
import app from '../../../../app';
import * as reviewCheck from '../../../check/review';
import * as memberCheck from '../../../check/member';

import * as common from '../../../component/common';

const getReviewCommentsTest = () => {
	describe('GET /v1/admins/reviews/:review_id/comment', () => {
		const request = agent(app);
		let setData = null;
		let reviewId = 43514;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		test('should return invalid status if reviewid not number', (done) => {
			reviewId = 'not number';
			request
				.get(`/v1/admins/reviews/${reviewId}/comment`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if reviewid is invalid', (done) => {
			reviewId = 8898999;
			request
				.get(`/v1/admins/reviews/${reviewId}/comment`)
				.set(setData)
				.expect(500, done);
		});

		test('should return review comments data if success get review comments list', (done) => {
			reviewId = 43514;
			request
				.get(encodeURI(`/v1/admins/reviews/${reviewId}/comment`))
				.set(setData)
				.expect(200)
				.end((err, res) => {
					const reviewCommentsList = res.body.list;
					common.listAttrTypeCheck([res.body.total, res.body.limit, res.body.page]);

					for (let i = 0; i < reviewCommentsList.length; i += 1) {
						// 리뷰 댓글 검사
						reviewCheck.checkReviewComment(reviewCommentsList[i]);
						reviewCheck.checkReviewCommentContent(reviewCommentsList[i].content);
						reviewCheck.checkReviewCommentCount(reviewCommentsList[i].count);

						// 회원 검사
						memberCheck.checkMember(reviewCommentsList[i].member);
						memberCheck.checkMemberAttribute(reviewCommentsList[i].member.attribute);
					}

					return done();
				});
		});
	});
};

export default getReviewCommentsTest;
