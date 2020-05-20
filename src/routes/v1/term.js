import express from 'express';
import { wrapAsyncRouter } from '../../services';
import * as termService from '../../services/term/term';
import * as termValidator from '../../validators/term';

const router = express.Router();

// 약관 조회
router.get(
	'/',
	...termValidator.getTerm,
	wrapAsyncRouter(async (req, res) => {
		const searchFields = {};

		if (req.query.id) searchFields.id = req.query.id;
		if (req.query.type) searchFields.type = req.query.type;

		// 약관 조회
		const term = await termService.getTermBySearchFields(searchFields);

		// Return
		return res.json(term);
	}),
);

// 약관 등록
router.post(
	'/',
	...termValidator.postTerm,
	wrapAsyncRouter(async (req, res) => {
		const term = {
			type: req.body.type,
			contents: req.body.contents,
		};

		// 약관 등록 처리
		const response = await termService.registerTerm(term);

		return res.json({ term: response });
	}),
);

// 약관 수정
router.patch(
	'/:term_id/modification',
	...termValidator.patchModificationTerm,
	wrapAsyncRouter(async (req, res) => {
		const term = { id: req.params.term_id };
		if (req.body.type) term.type = req.body.type;
		if (req.body.contents) term.contents = req.body.contents;

		// 약관 수정 처리
		await termService.updateTerm(term);

		return res.json(null);
	}),
);

// 약관 삭제
router.delete(
	'/:term_id/elimination',
	...termValidator.deleteEliminationTerm,
	wrapAsyncRouter(async (req, res) => {
		// 약관 삭제 처리
		await termService.deleteTerm(req.params.term_id);

		return res.json(null);
	}),
);

export default router;
