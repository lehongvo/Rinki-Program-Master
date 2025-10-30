import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Favorites } from "../target/types/favorites";
import { assert, expect } from "chai";
import { PublicKey } from "@solana/web3.js";

type FavoriteSetup = {
  number: number;
  color: string;
  hashtag: string[];
};

describe("<=========> Favorites Program <========>", () => {
  let program: Program<Favorites>;
  let user: any;
  let favoriteSetupData: FavoriteSetup[] = [];

  // Before each test, set the provider and get the program and user
  beforeEach(async () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    program = anchor.workspace.favorites as Program<Favorites>;
    user = anchor.AnchorProvider.env().wallet;

    favoriteSetupData = [
      {
        number: 1,
        color: "red",
        hashtag: ["blue", "green", "yellow", "purple", "orange"],
      },
      {
        number: 2,
        color: "blue",
        hashtag: ["red", "green", "yellow", "purple", "orange"],
      },
      {
        number: 3,
        color: "green",
        hashtag: ["red", "blue", "yellow", "purple", "orange"],
      },
    ];
  });
  
  // Test to verify program id and wallet address
  describe("Show be verify program id and wallet address", () => {
    it("Show be check program id", async () => {
      const programId = program.programId;
      assert.equal(programId.toBase58().length > 0, true, "ERROR_01: Program ID should be not empty");
    });
  
    it("Show be check user", async () => {
      const user = anchor.AnchorProvider.env().wallet;
      assert.equal(user.publicKey.toBase58().length > 0, true, "ERROR_02: User should be not empty");
    });

    it("Show be check favorite setup data", async () => {
      favoriteSetupData.forEach(async (favorite) => {
        assert.equal(favorite.number > 0, true, "ERROR_03: Favorite setup data number should be not empty");
        assert.equal(favorite.color.length > 0, true, "ERROR_04: Favorite setup data color should be not empty");
        assert.equal(favorite.hashtag.length > 0, true, "ERROR_05: Favorite setup data hashtag should be not empty");
      });
    });
  });
  
  // Test to verify set favorite
  describe("Show be verify set favorite", () => {
    it("Show be verify set favorite", async () => {
      const tx = await program.methods.setFavorite(new anchor.BN(favoriteSetupData[0].number), favoriteSetupData[0].color, favoriteSetupData[0].hashtag).accounts({
        user: user.publicKey,
      }).rpc();
      assert.equal(tx.length > 0, true, "ERROR_06: Transaction signature should be not empty");
      
      const pdaOfFavoriteAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("favorite"), user.publicKey.toBuffer()],
        program.programId
      )[0];

      const favoriteAccount = await program.account.favoriteAccount.fetch(pdaOfFavoriteAccount);
      assert.equal(favoriteAccount.number.toNumber() === favoriteSetupData[0].number, true, "ERROR_07: Favorite account number should be equal to favorite setup data number");
      assert.equal(favoriteAccount.color === favoriteSetupData[0].color, true, "ERROR_08: Favorite account color should be equal to favorite setup data color");
      assert.equal(favoriteAccount.hashtag.length === favoriteSetupData[0].hashtag.length, true, "ERROR_09: Favorite account hashtag length should be equal to favorite setup data hashtag length");
      assert.equal(favoriteAccount.hashtag.every((hashtag: string) => favoriteSetupData[0].hashtag.includes(hashtag)), true, "ERROR_10: Favorite account hashtag should be equal to favorite setup data hashtag");
    });
  });

  // Test to verify delete favorite
  describe("Show be verify delete favorite", () => {
    it("Show be verify delete favorite", async () => {
      const pdaOfFavoriteAccount = PublicKey.findProgramAddressSync(
        [Buffer.from("favorite"), user.publicKey.toBuffer()],
        program.programId
      )[0];

      const beforeDeleteFavoriteAccount = await program.account.favoriteAccount.fetch(pdaOfFavoriteAccount);
      assert.equal(beforeDeleteFavoriteAccount.number.toNumber() === favoriteSetupData[0].number, true, "ERROR_12: Before delete favorite account number should be equal to favorite setup data number");
      assert.equal(beforeDeleteFavoriteAccount.color === favoriteSetupData[0].color, true, "ERROR_13: Before delete favorite account color should be equal to favorite setup data color");
      assert.equal(beforeDeleteFavoriteAccount.hashtag.length === favoriteSetupData[0].hashtag.length, true, "ERROR_14: Before delete favorite account hashtag length should be equal to favorite setup data hashtag length");
      assert.equal(beforeDeleteFavoriteAccount.hashtag.every((hashtag: string) => favoriteSetupData[0].hashtag.includes(hashtag)), true, "ERROR_15: Before delete favorite account hashtag should be equal to favorite setup data hashtag");

      const tx = await program.methods.deleteFavorite().accounts({
        user: user.publicKey,
      }).rpc();
      assert.equal(tx.length > 0, true, "ERROR_11: Transaction signature should be not empty");

      try {
        await program.account.favoriteAccount.fetch(pdaOfFavoriteAccount);
        assert.fail("Account should be closed and fetch should throw");
      } catch (err) {
        assert.ok(err.message.includes("Account does not exist") || err.message.includes("failed"), "Should throw Account does not exist error");
      }
    });
  });
});