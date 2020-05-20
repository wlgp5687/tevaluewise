import * as common from '../component/common';

// 과목 검사
export const checkSubject = (subject) => {
	if (subject.id) expect(typeof subject.id).toEqual('number');
	if (subject.name) expect(typeof subject.name).toEqual('string');
	if (subject.comment) expect(typeof subject.comment).toEqual('string');
	if (subject.sort_no) expect(typeof subject.sort_no).toEqual('number');
	if (subject.is_deleted) expect(common.agreementCheck(subject.is_deleted)).toEqual(true);
};
