import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { useActiveWallet } from "@/hooks/useActiveWallet";
import { useFaucet } from "@/hooks/useFaucet";
import { bn } from "fuels";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Faucet() {
  const { faucetWallet } = useFaucet();
  const { wallet, refreshWalletBalance } = useActiveWallet();

  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [amountToSend, setAmountToSend] = useState<string>("5");

  useEffect(() => {
    if (wallet) {
      setReceiverAddress(wallet.address.toB256());
    }
  }, [wallet]);

  const sendFunds = async () => {
    if (!faucetWallet) {
      return toast.error("Faucet wallet not found.");
    }

    if (!receiverAddress) {
      return toast.error("Receiver address not set");
    }

    if (!amountToSend) {
      return toast.error("Amount cannot be empty");
    }

    const tx = await faucetWallet.transfer(
      receiverAddress,
      bn.parseUnits(amountToSend.toString()),
    );
    await tx.waitForResult();

    toast.success("Funds sent!");

    await refreshWalletBalance?.();
  };

  return (
    <>
      <h3 className="text-2xl font-semibold">Local Faucet</h3>

      <div className="flex gap-4 items-center">
        <label htmlFor="receiver-address-input" className="text-gray-400">
          Receiving address:
        </label>
        <Input
          className="w-full"
          value={receiverAddress}
          onChange={(e) => setReceiverAddress(e.target.value)}
          placeholder="0x..."
          id="receiver-address-input"
        />
      </div>

      <div className="flex gap-4 items-center">
        <label htmlFor="amount-input" className="text-gray-400">
          Amount (ETH):
        </label>
        <Input
          className="w-full"
          value={amountToSend}
          onChange={(e) => setAmountToSend(e.target.value)}
          placeholder="5"
          type="number"
          id="amount-input"
        />
      </div>

      <Button onClick={sendFunds}>Send Funds</Button>
    </>
  );
}
