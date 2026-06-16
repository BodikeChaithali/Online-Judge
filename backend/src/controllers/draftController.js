import Draft from "../models/draftModel.js";

export const saveDraft = async (req, res) => {
  try {
    const { email, problemId, language, code, lastLanguage } = req.body;

    if (!email || !problemId || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    const draft = await Draft.findOneAndUpdate(
      { email, problemId },
      {
        $set: {
          [`drafts.${language}`]: code,
          lastLanguage: lastLanguage || language,
        },
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.json({
      success: true,
      draft,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const getDraft = async (req, res) => {
  try {
    const { email, problemId } = req.params;

    const draft = await Draft.findOne({
      email,
      problemId,
    });

    return res.json({
      success: true,
      draft,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

export const deleteLanguageDraft = async (req, res) => {
  try {
    const { email, problemId, language } = req.body;

    await Draft.findOneAndUpdate(
      { email, problemId },
      {
        $unset: {
          [`drafts.${language}`]: "",
        },
      },
    );

    return res.json({
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
