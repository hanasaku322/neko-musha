# Credits

- BGM: "Looping Japanese fight track" by Pepsidog, OpenGameArt.org, CC0.
- SFX: Kenney Impact Sounds, Casino Audio, and Interface Sounds, Creative Commons CC0. https://kenney.nl/assets/impact-sounds https://kenney.nl/assets/casino-audio https://kenney.nl/assets/interface-sounds
- Individual character sprites, stage background, and item atlas: generated with Codex ImageGen for this project.
- Character animation sprite sheets: generated with Codex ImageGen as hand-drawn multi-pose frames for this project.
- Protagonist visual direction: based on the user-provided calico eyepatch cat samurai reference.

品質改善版の assets/sengoku-stage-v2.png は、既存ステージ画像を編集対象としてOpenAI画像生成ツールで作成（2026年10月）。元画像 assets/sengoku-stage.webp は保管しています。

assets/characters/hero-motion-v2.png：既存の猫武者を参照し、OpenAI画像生成ツールで歩行・斬撃用の連続コマを作成。透明な各コマを抽出し、共通の足元位置に揃えて16コマのアトラスへ配置。元のキャラクター画像・連続コマは保管。

assets/vfx/combat-atlas.png：OpenAI画像生成ツールで制作したアニメ調の霊刃・炎・金属・電撃・斬撃・衝撃の質感素材。各効果を透明余白付きの8区画へ配置し、combat-vfx.js の動的な輪郭・軌跡・寿命の処理と重ねています。
`heavy-overlord-motion.png`、`heavy-oniElite-motion.png`: OpenAI ImageGenによる連続ポーズ素材。スマホ版は各アトラスを縮小。重装・赤鬼のsupportアトラスは既存フレームから構成。

古社の濡れた石畳 assets/shrine/terrain-storm.webp: OpenAI ImageGenで生成し、WebPへ圧縮。雨・落雷・結界・参道はCanvas描画。

雷雨の古社BGM「月下の刃」: ユーザー提供のMP3をそのまま使用。assets/bgm/shrine-gekkano-yaiba.mp3。

古社の歩行コマ7種（walk-*-v2.webp）: 既存キャラを参照してOpenAI ImageGenで歩行連続コマを生成。共通位置でアトラス化し、タッチ端末向けに縮小版を作成。

戦国の夜の歩行コマ5種（assets/characters/walk-*-v2.webp）: 既存キャラを参照しOpenAI ImageGenで生成。共通基準でアトラス化。タッチ端末向けは縮小版。
