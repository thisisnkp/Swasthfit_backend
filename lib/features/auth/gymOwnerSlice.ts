import { createSlice } from "@reduxjs/toolkit";

interface OwnerData {
  mobile: string;
  email: string;
  name: string;
}

interface OwnerState {
  owner: OwnerData | null;
}

const initialState: OwnerState = {
  owner: null,
};

const gymOwnerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    setOwner: (state, action) => {
      state.owner = action.payload;
    },
  },
});

export const { setOwner } = gymOwnerSlice.actions;
export default gymOwnerSlice.reducer;
