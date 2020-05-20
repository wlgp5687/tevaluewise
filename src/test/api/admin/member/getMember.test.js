import { agent } from 'supertest';
import app from '../../../../app';
import * as memberCheck from '../../../check/member';
import * as tutorCheck from '../../../check/tutor';
import * as instituteCheck from '../../../check/institute';

import * as common from '../../../component/common';

const getMemberTest = () => {
	describe('GET /v1/admins/members/:member_id', () => {
		const request = agent(app);
		let setData = null;
		let memberId = null;

		beforeAll(async () => {
			const token = await common.getToken(request);
			const adminToken = await common.adminLogin(request, token);
			setData = {
				'csrf-token': token.decoded_token.csrf,
				'x-access-token': adminToken.token,
			};
		});

		beforeEach(() => {
			memberId = 29;
		});

		test('should return invalid status if member_id is not number', (done) => {
			memberId = 'notNumber';
			request
				.get(`/v1/admins/members/${memberId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return invalid status if memberId is not exist', (done) => {
			memberId = 9999999;
			request
				.get(`/v1/admins/members/${memberId}`)
				.set(setData)
				.expect(500, done);
		});

		test('should return member data if success get member is tutor', (done) => {
			memberId = 6705;
			request
				.get(`/v1/admins/members/${memberId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { member } = res.body;
					memberCheck.checkMember(member);
					memberCheck.checkMemberAttribute(member.attribute);
					memberCheck.checkMemberAccess(member.access);
					memberCheck.checkMemberAddress(member.address);
					if (member.external) memberCheck.checkMemberExternals(member.external);
					if (member.auth_review) memberCheck.checkMemberReviewAuth(member.auth_review);
					if (member.request_auth) memberCheck.checkMemberRequestAuth(member.request_auth);
					if (member.tutor) tutorCheck.checkTutor(member.tutor);
					if (member.institute) instituteCheck.checkInstitute(member.institute);
					return done();
				});
		});

		test('should return member data if success get member is institute', (done) => {
			memberId = 6704;
			request
				.get(`/v1/admins/members/${memberId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { member } = res.body;
					memberCheck.checkMember(member);
					memberCheck.checkMemberAttribute(member.attribute);
					memberCheck.checkMemberAccess(member.access);
					memberCheck.checkMemberAddress(member.address);
					if (member.external) memberCheck.checkMemberExternals(member.external);
					if (member.auth_review) memberCheck.checkMemberReviewAuth(member.auth_review);
					if (member.request_auth) memberCheck.checkMemberRequestAuth(member.request_auth);
					if (member.tutor) tutorCheck.checkTutor(member.tutor);
					if (member.institute) instituteCheck.checkInstitute(member.institute);
					return done();
				});
		});

		test('should return member data if success get member', (done) => {
			request
				.get(`/v1/admins/members/${memberId}`)
				.set(setData)
				.expect(200)
				.end((err, res) => {
					if (err) return done(err);

					const { member } = res.body;
					memberCheck.checkMember(member);
					memberCheck.checkMemberAttribute(member.attribute);
					memberCheck.checkMemberAccess(member.access);
					memberCheck.checkMemberAddress(member.address);
					if (member.external) memberCheck.checkMemberExternals(member.external);
					if (member.auth_review) memberCheck.checkMemberReviewAuth(member.auth_review);
					if (member.request_auth) memberCheck.checkMemberRequestAuth(member.request_auth);
					if (member.tutor) tutorCheck.checkTutor(member.tutor);
					if (member.institute) instituteCheck.checkInstitute(member.institute);
					return done();
				});
		});
	});
};

export default getMemberTest;
