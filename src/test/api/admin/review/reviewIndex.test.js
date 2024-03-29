import getChoiceAnswersTest from './getChoiceAnswers.test';
import getReviewInstituteChangeTest from './getReviewInstituteChange.test';
import getReviewInstituteNormalTest from './getReviewInstituteNormal.test';
import getReviewsInstituteChangeTest from './getReviewsInstituteChange.test';
import getReviewsInstituteNormalTest from './getReviewsInstituteNormal.test';
import getReviewCommentsTest from './getReviewComments.test';
import deleteReviewCommentTest from './deleteReviewComment.test';
import patchReviewComment from './patchReviewComment.test';
import postReviewComment from './postReviewComment.test';
import patchReviewConfirm from './patchReviewConfirm.test';
import getReviewTutorChangeTest from './getReviewTutorChange.test';
import getReviewTutorNormalTest from './getReviewTutorNormal.test';
import getReviewsTutorChangeTest from './getReviewsTutorChange.test';
import getReviewsTutorNormalTest from './getReviewsTutorNormal.test';
import patchQuestionChoiceAnswerTest from './patchQuestionChoiceAnswer.test';
import patchQuestionTextAnswerTest from './patchQuestionTextAnswer.test';
import patchQuestionYearAnswerTest from './patchQuestionYearAnswer.test';
import patchQuestionPointAnswerTest from './patchQuestionPointAnswer.test';
import getQuestionAnswersTest from './getQuestionAnswers.test';
import getTutorReviewsByInstituteIdTest from './getTutorReviewsByInstituteId.test';
import getInstituteReviewsByInstituteIdTest from './getInstituteReviewsByInstituteId.test';
import getTutorChangeReviewsByInstituteId from './getTutorChangeReviewsByInstituteId.test';
import getInstituteChangeReviewsByInstituteId from './getInstituteChangeReviewsByInstituteId.test';
import getTutorReviewsByTutorIdTest from './getTutorReviewsByTutorId.test';
import getTutorChangeReviewsByTutorIdTest from './getTutorChangeReviewsByTutorId.test';

describe('ROUTER /v1/admins/reviews', () => {
	getChoiceAnswersTest();
	getReviewInstituteChangeTest();
	getReviewInstituteNormalTest();
	getReviewsInstituteChangeTest();
	getReviewsInstituteNormalTest();
	getReviewCommentsTest();
	deleteReviewCommentTest();
	patchReviewComment();
	postReviewComment();
	patchReviewConfirm();
	getReviewTutorChangeTest();
	getReviewTutorNormalTest();
	getReviewsTutorChangeTest();
	getReviewsTutorNormalTest();
	patchQuestionChoiceAnswerTest();
	patchQuestionTextAnswerTest();
	patchQuestionYearAnswerTest();
	patchQuestionPointAnswerTest();
	getQuestionAnswersTest();
	getTutorReviewsByInstituteIdTest();
	getInstituteReviewsByInstituteIdTest();
	getTutorChangeReviewsByInstituteId();
	getInstituteChangeReviewsByInstituteId();
	getTutorReviewsByTutorIdTest();
	getTutorChangeReviewsByTutorIdTest();
});
