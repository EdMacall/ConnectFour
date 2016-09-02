var i, j, k, XMouseOver, LastEvent, IsOver = -1, NBlink = 0, IsStart0;
var Start, I_Sel, Start0, MaxWidth = 9, MaxHeight = 7, Size = 1;
var NeedBallDown, MoveCount, MaxMoveCount, MaxMove, MaxFld = MaxWidth * MaxHeight;
IsPlayer = new Array(2);
Level = new Array(2);
Fld = new Array(MaxWidth);

for (i = 0; i < MaxWidth; i++)
    Fld[i] = new Array(MaxHeight);

FldCount = new Array(MaxWidth);
Value = new Array(MaxWidth);
History = new Array(MaxFld);
Pic = new Array(7);

for (i = 0; i < 6; i++)
{
  Pic[i] = new Image();
  Pic[i].src = "/connectfour/connect" + i + ".gif";
}

Pic[6] = new Image();
Pic[6].src = "/connectfour/transparent.gif";

IsStart0 = true;
IsPlayer[0] = true;
IsPlayer[1] = false;
Level[0] = 2;
Level[1] = 3;

function Init() 
{
  var ii, jj;

  for (ii = 0; ii < MaxWidth; ii++)
  {
    for (jj = 0; jj < MaxHeight; jj++)
      Fld[ii][jj] = 0;

    FldCount[ii] = 0;
  }

  if (IsStart0) Start0 = true;
  else Start0 = false;

  LastEvent = "";
  NeedBallDown = 0;
  I_Sel = -1;
  MoveCount = 0;
  MaxMoveCount = 0;
  MaxMove = (MaxWidth - 2 * Size) * (MaxHeight - Size);
  XMouseOver = -1;
  RefreshScreen();
  IsOver = 0;
  NBlink = 0;
}

function SetOption(nn, mm)
{
  if (nn < 2)
  {
    if (mm == 0)
      IsPlayer[nn] = true;
    else
      IsPlayer[nn] = false;
  }
  else IsStart0 = mm;
}

function SetLevel(nn, mm) 
{
  Level[nn] = mm;
}

function SetSize(ss)
{
  Size = ss;
  Init();
}

function Timer() 
{
  if (IsOver < 0) return;

  if (IsOver > 0) { Blink(); return; }

  if (NeedBallDown == 0)
  {
    if ((((MoveCount + Start0) % 2 == 1) && (IsPlayer[0])) ||
      (((MoveCount + Start0) % 2 == 0) && (IsPlayer[1])));
    else
    {
      if (LastEvent == "") GetBestMove(((MoveCount + 1 + Start0) % 2) * 2 - 1);

      if (LastEvent == "Back") { Back(); LastEvent = ""; }

      if (LastEvent == "Replay") { Replay(); LastEvent = ""; }
    }
  }

  if (NeedBallDown > 0)
  {
    if (Fld[I_Sel][NeedBallDown - 1] == 0)
    {
      if (NeedBallDown < MaxHeight - Size)
        window.document.images[MaxWidth * (MaxHeight - Size - NeedBallDown) + XMouseOver].src = Pic[1].src;
      else
        window.document.images[MaxWidth * (MaxHeight - Size - NeedBallDown) + XMouseOver].src = Pic[4].src;

      if ((MoveCount + Start0) % 2 == 1)
        window.document.images[MaxWidth * (MaxHeight + 1 - Size - NeedBallDown) + XMouseOver].src = Pic[0].src;
      else
        window.document.images[MaxWidth * (MaxHeight + 1 - Size - NeedBallDown) + XMouseOver].src = Pic[2].src;
    }

    if (NeedBallDown > 1)
    {
      if (Fld[I_Sel][NeedBallDown - 2] != 0)
        NeedBallDown = 1;
    }

    if (NeedBallDown == 1)
    {
      if (MoveCount + 1 < 10)
        window.document.OptionsForm.Moves.value = " " + eval(MoveCount + 1) + " ";
      else
        window.document.OptionsForm.Moves.value = MoveCount + 1;
      MakeMove();
    }

    NeedBallDown--;
  }
}

function Back()
{
  if (NeedBallDown > 0) { LastEvent = "Back"; return; }

  if (MoveCount > 0)
  {
    if ((IsOver > 0) && (NBlink % 2 == 0)) Blink();

    IsOver = 0;
    NBlink = 0;
    MoveCount--;
    var ii = History[MoveCount];
    var kk = --FldCount[ii];
    Fld[ii][kk] = 0;

    if (MoveCount < 10)
      window.document.OptionsForm.Moves.value = " " + eval(MoveCount) + " ";
    else
      window.document.OptionsForm.Moves.value = MoveCount;

    RefreshPic(ii, kk);
  }
}

function Replay()
{
    if (NeedBallDown > 0) { LastEvent = "Replay"; return; }

    if (MoveCount < MaxMoveCount) {
        I_Sel = History[MoveCount];

        if (MoveCount + 1 < 10)
            window.document.OptionsForm.Moves.value = " " + eval(MoveCount + 1) + " ";
        else
            window.document.OptionsForm.Moves.value = MoveCount + 1;

        MakeMove();
        RefreshPic(I_Sel, FldCount[I_Sel] - 1);
    }
}

function MakeMove()
{
    var ccol, kk;
    ccol = ((MoveCount + 1 + Start0) % 2) * 2 - 1;
    kk = FldCount[I_Sel]++;
    Fld[I_Sel][kk] = ccol;

    if (History[MoveCount] != I_Sel) {
        History[MoveCount] = I_Sel;
        MaxMoveCount = MoveCount + 1;
    }

    MoveCount++;

    if (MaxMoveCount < MoveCount)
        MaxMoveCount = MoveCount;

    IsOver = IsWinning(I_Sel, kk, ccol);

    if (IsOver > 0) {
        if (ccol < 0) alert("Red has won !");
        else alert("Green has won !");
    }
    else {
        if (MoveCount == MaxMove) {
            IsOver = -1;
            alert("It's a draw !");
        }
    }
}

function GetBestMove(theCol)
{
    var ii, kk, zz, vv, vvbest, nn, cc = theCol;
    var iiw, kkw, wwcount;
    var LLevel = Level[(MoveCount + 1 + Start0) % 2];
    I_Sel = -1;

    for (ii = Size; ii < MaxWidth - Size; ii++) {
        if ((kk = FldCount[ii]) < MaxHeight - Size) {
            Fld[ii][kk] = cc;
            if (IsWinning(ii, kk, cc)) {
                Fld[ii][kk] = 0;
                Select(ii);
                return;
            }
            Fld[ii][kk] = 0;
        }
    }

    nn = 0;

    for (ii = Size; ii < MaxWidth - Size; ii++) {
        Value[ii] = 0;
        if ((kk = FldCount[ii]) < MaxHeight - Size) {
            nn++;
            Fld[ii][kk] = -cc;

            if (IsWinning(ii, kk, -cc)) {
                Fld[ii][kk] = 0;
                Select(ii);
                return;
            }
            Fld[ii][kk] = 0;
        }
    }

    if (LLevel > 2) {
        for (ii = Size; ii < MaxWidth - Size; ii++) {
            if ((kk = FldCount[ii]) < MaxHeight - Size) {
                wwcount = 0;
                Fld[ii][kk] = cc;
                if (kk < MaxHeight - 1 - Size) {
                    if ((wwcount = CanWin(ii, kk + 1, cc)) == 2) {
                        Fld[ii][kk] = 0;
                        Select(ii);
                        return;
                    }
                }

                if (wwcount >= 0) {
                    for (iiw = Size; iiw < MaxWidth - Size; iiw++) {
                        if ((kkw = FldCount[iiw]) < MaxHeight - Size) {
                            if (ii != iiw) {
                                Fld[iiw][kkw] = cc;
                                if (IsWinning(iiw, kkw, cc))
                                    wwcount++;
                                Fld[iiw][kkw] = 0;
                                if (wwcount > 1) {
                                    Fld[ii][kk] = 0;
                                    Select(ii);
                                    return;
                                }
                            }
                        }
                    }
                }
                Fld[ii][kk] = 0;
            }
        }
    }

    if (LLevel > 3) {
        for (ii = Size; ii < MaxWidth - Size; ii++) {
            if ((kk = FldCount[ii]) < MaxHeight - Size) {
                vv = 0;
                Fld[ii][kk] = cc;
                if (kk < MaxHeight - 1 - Size) {
                    Fld[ii][kk + 1] = -cc;
                    if (IsWinning(ii, kk + 1, -cc))
                        vv = -1;
                    Fld[ii][kk + 1] = 0;
                }
                if (vv == 0) {
                    Fld[ii][kk] = -cc;
                    if (kk < MaxHeight - 1 - Size) {
                        Fld[ii][kk + 1] = cc;
                        if (IsWinning(ii, kk + 1, cc))
                            Value[ii] = -200;
                        Fld[ii][kk + 1] = 0;
                    }
                    for (iiw = Size; iiw < MaxWidth - Size; iiw++) {
                        if ((kkw = FldCount[iiw]) < MaxHeight - Size) {
                            if (ii != iiw) {
                                if ((vv = CanWin(iiw, kkw, -cc)) == 2) {
                                    Fld[ii][kk] = 0;
                                    Select(ii);
                                    return;
                                }
                                if (vv == -1)
                                    Value[ii] = -100;
                            }
                        }
                    }
                    Fld[ii][kk] = cc;
                    if (kk < MaxHeight - 1 - Size) {
                        Fld[ii][kk + 1] = -cc;
                        for (iiw = Size; iiw < MaxWidth - Size; iiw++) {
                            if ((kkw = FldCount[iiw]) < MaxHeight - Size) {
                                if (ii != iiw) {
                                    if (CanWin(iiw, kkw, -cc) == 2)
                                        Value[ii] = -5000;
                                }
                            }
                        }
                        Fld[ii][kk + 1] = 0;
                    }
                }
                Fld[ii][kk] = 0;
            }
        }
    }
    if (nn == 0)
    { IsOver = -1; return; }
    zz = 0;
    nn = 0;
    for (ii = Size; ii < MaxWidth - Size; ii++) {
        if ((kk = FldCount[ii]) < MaxHeight - Size) {
            Fld[ii][kk] = cc;
            if (kk < MaxHeight - 1 - Size) {
                Fld[ii][kk + 1] = -cc;
                if (IsWinning(ii, kk + 1, -cc)) {
                    vv = -8100;
                    Fld[ii][kk + 1] = 0;
                }
                else {
                    Fld[ii][kk + 1] = 0;
                    vv = GetValue(ii, kk, cc);
                }
            }
            else
                vv = GetValue(ii, kk, cc);
            if (LLevel < 2) vv += Math.floor(Math.random() * 29);
            if (LLevel < 3) vv += Math.floor(Math.random() * 19);
            if (LLevel == 3) vv += Math.floor(Math.random() * 9);
            if (LLevel == 4) vv += Math.floor(Math.random() * 4);
            Value[ii] += vv;
            if (zz == 0) vvbest = Value[ii];
            zz++;
            if (Value[ii] == vvbest)
                nn++;
            if (Value[ii] > vvbest) {
                nn = 1;
                vvbest = Value[ii];
            }
            Fld[ii][kk] = 0;
        }
    }
    zz = Math.floor(Math.random() * nn);
    nn = -1;
    for (ii = Size; ii < MaxWidth - Size; ii++) {
        if ((kk = FldCount[ii]) < MaxHeight - Size) {
            if (vvbest == Value[ii]) {
                nn++;
                if (nn == zz) {
                    Select(ii);
                    return;
                }
            }
        }
    }
}

function CanWin(ii, kk, cc) {
    var kkl, kkk = kk - 1;
    var vv = 0;

    do {
        kkk++;
        Fld[ii][kkk] = -cc;
        if ((IsWinning(ii, kkk, -cc))) {
            for (kkl = kk; kkl <= kkk; kkl++)
                Fld[ii][kkl] = 0;
            if (kkk == kk) return (-1);
            else return (vv);
        }
        Fld[ii][kkk] = cc;
        if ((IsWinning(ii, kkk, cc)) && (kkk < MaxHeight - 1 - Size)) {
            if (kkk == kk) vv++;
            Fld[ii][kkk] = -cc;
            Fld[ii][kkk + 1] = cc;
            if ((IsWinning(ii, kkk + 1, cc))) {
                for (kkl = kk; kkl <= kkk + 1; kkl++)
                    Fld[ii][kkl] = 0;
                return (2);
            }
            Fld[ii][kkk + 1] = 0;
        }
        Fld[ii][kkk] = -cc;
    }
    while (kkk < MaxHeight - 1 - Size);
    for (kkl = kk; kkl <= kkk; kkl++)
        Fld[ii][kkl] = 0;
    return (vv);
}

function GetValue(ii, kk, ccol)
{
    var bb, cc, ccount, hh, jj, ll, ss, vval = (ii + 1) * (MaxWidth - ii), mm, nn;

    for (jj = -1; jj <= 1; jj += 2) {
        nn = 0;

        for (hh = -1; hh <= 1; hh++) {
            ccount = 0; ss = 0;
            ll = 0;
            mm = 0;

            do {
                ll++;
                cc = FldCol(ii + ll, kk + hh * ll);
                if (jj * cc * ccol == cc * cc) {
                    bb = true;
                    ss++;
                    ccount += 3 * cc * cc * (4 - ll) + 1;
                    mm += cc * cc;
                }
                else bb = false;
            }
            while ((ll < 3) && (bb))
            if (ss > 2) vval += (2 - hh * hh) * ccount;
            if ((ll == 3) && (mm == 2)) nn++;
        }
        for (hh = -1; hh <= 1; hh++) {
            ccount = 0; ss = 0;
            ll = 0;
            mm = 0;
            do {
                ll++;
                cc = FldCol(ii - ll, kk + hh * ll);
                if (jj * cc * ccol == cc * cc) {
                    bb = true;
                    ss++;
                    ccount += 3 * cc * cc * (4 - ll) + 1;
                    mm += cc * cc;
                }
                else bb = false;
            }
            while ((ll < 3) && (bb))
            if (ss > 2) vval += (2 - hh * hh) * ccount;
            if ((ll == 3) && (mm == 2)) nn++;
        }
        ll = 0;
        mm = 0;
        do {
            ll++;
            cc = FldCol(ii, kk - ll);
            if (jj * cc * ccol == cc * cc) {
                bb = true;
                mm += cc * cc;
            }
            else bb = false;
        }
        while ((ll < 3) && (bb))
        if ((ll == 3) && (mm == 2)) nn++;
        vval += 16 * (nn - 1);
    }
    return (vval);
}

function FldCol(ww, hh)
{
    if (ww < Size) return (-2);

    if (hh < 0) return (-2);

    if (ww >= MaxWidth - Size) return (-2);

    if (hh >= MaxHeight - Size) return (-2);

    return (Fld[ww][hh]);
}

function IsWinning(ii, kk, ccol)
{
    var ll, ccount;
    ccount = 1;
    ll = 0;

    while (FldCol(ii + ll + 1, kk) == ccol) {
        ll++;
        ccount++;
    }

    ll = 0;

    while (FldCol(ii - ll - 1, kk) == ccol) {
        ll++;
        ccount++;
    }

    if (ccount >= 4) return (1);

    ccount = 1;
    ll = 0;

    while (FldCol(ii + ll + 1, kk + ll + 1) == ccol) {
        ll++;
        ccount++;
    }

    ll = 0;

    while (FldCol(ii - ll - 1, kk - ll - 1) == ccol) {
        ll++;
        ccount++;
    }

    if (ccount >= 4) return (2);

    ccount = 1;
    ll = 0;

    while (FldCol(ii + ll + 1, kk - ll - 1) == ccol) {
        ll++;
        ccount++;
    }

    ll = 0;

    while (FldCol(ii - ll - 1, kk + ll + 1) == ccol) {
        ll++;
        ccount++;
    }

    if (ccount >= 4) return (3);

    ccount = 1;
    ll = 0;

    while (FldCol(ii, kk - ll - 1) == ccol) {
        ll++;
        ccount++;
    }

    if (ccount >= 4) return (4);

    return (0);
}

function Blink()
{
  var ii = I_Sel, kk = FldCount[ii] - 1, ll, cc;
  var ccol = ((MoveCount + Start0) % 2) * 2 - 1;
  NBlink++;

  if (NBlink % 2 == 0) cc = 1;
  else cc = ccol + 1;

  if (IsOver == 1)
  {
    ll = 0;

    while (FldCol(ii + ll, kk) == ccol)
    {
      window.document.images[ii + ll + MaxFld - (kk + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }

    ll = 0;

    while (FldCol(ii - ll, kk) == ccol)
    {
      window.document.images[ii - ll + MaxFld - (kk + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }
  }

  if (IsOver == 2)
  {
    ll = 0;
    while (FldCol(ii + ll, kk + ll) == ccol)
    {
      window.document.images[ii + ll + MaxFld - (kk + ll + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }

    ll = 0;

    while (FldCol(ii - ll, kk - ll) == ccol)
    {
      window.document.images[ii - ll + MaxFld - (kk - ll + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }
  }
  
  if (IsOver == 3)
  {
    ll = 0;

    while (FldCol(ii + ll, kk - ll) == ccol)
    {
      window.document.images[ii + ll + MaxFld - (kk - ll + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }

    ll = 0;

    while (FldCol(ii - ll, kk + ll) == ccol)
    {
      window.document.images[ii - ll + MaxFld - (kk + ll + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }
  }

  if (IsOver == 4)
  {
    ll = 0;

    while (FldCol(ii, kk - ll) == ccol)
    {
      window.document.images[ii + MaxFld - (kk - ll + Size) * MaxWidth].src = Pic[cc].src;
      ll++;
    }
  }

  if (NBlink == 15) IsOver = -1;
}

function Select(ii)
{
    I_Sel = ii;
    XMouseOver = ii;
    NeedBallDown = MaxHeight - Size;
}

function Clicked(xx)
{
    if (IsOver != 0) return;

    if (NeedBallDown > 0) return;

    if (xx < Size) return;

    if (xx == MaxWidth - Size) return;

    MouseOut();
    MouseOver(xx);

    if (XMouseOver >= 0)
        NeedBallDown = MaxHeight - Size;

    window.document.OptionsForm.HelpButton.focus();
    window.document.OptionsForm.HelpButton.blur();
}

function MouseOver(xx)
{
  if (IsOver != 0) return;

  if (XMouseOver >= 0) return;

  if (xx < Size) return;

  if (xx == MaxWidth - Size) return;

  if ((((MoveCount + Start0) % 2 == 1) && (IsPlayer[0])) ||
        (((MoveCount + Start0) % 2 == 0) && (IsPlayer[1])))
  {
    if (NeedBallDown == 0)
    {
      if (Fld[xx][MaxHeight - 1 - Size] == 0)
      {
        if ((MoveCount + Start0) % 2 == 1)
          window.document.images[xx].src = Pic[3].src;
        else
          window.document.images[xx].src = Pic[5].src;

        XMouseOver = xx;
        I_Sel = xx;
      }
    }
  }
}

function MouseOut()
{
  if (IsOver != 0) return;

  if (XMouseOver >= 0)
  {
    if (NeedBallDown == 0)
    {
      window.document.images[XMouseOver].src = Pic[4].src;
      XMouseOver = -1;
      I_Sel = -1;
    }
  }
}

function RefreshPic(ii, jj)
{
  window.document.images[ii + MaxFld - (jj + Size) * MaxWidth].src = Pic[1 + Fld[ii][jj]].src;

  if (MoveCount < 10)
    window.document.OptionsForm.Moves.value = " " + eval(MoveCount) + " ";
  else
    window.document.OptionsForm.Moves.value = MoveCount;
}

function RefreshScreen()
{
  var ii, jj;

  for (ii = Size; ii < MaxWidth - Size; ii++)
  {
    for (jj = Size; jj < MaxHeight; jj++)
      window.document.images[ii + MaxFld - jj * MaxWidth].src = Pic[1 + Fld[ii][jj]].src;
  }

  if (Size > 0)
  {
    for (ii = 0; ii < MaxWidth; ii++)
      window.document.images[MaxFld + ii].src = Pic[6].src;
      
    for (jj = 0; jj <= MaxHeight; jj++)
    {
      window.document.images[jj * MaxWidth].src = Pic[6].src;
      window.document.images[(jj + 1) * MaxWidth - 1].src = Pic[6].src;
    }
  }
  else
  {
    window.document.images[0].src = Pic[4].src;
    window.document.images[MaxWidth - 1].src = Pic[4].src;
  }

  if (MoveCount < 10)
    window.document.OptionsForm.Moves.value = " " + eval(MoveCount) + " ";
  else
    window.document.OptionsForm.Moves.value = MoveCount;
}

function Resize()
{
  if (navigator.appName == "Netscape") history.go(0);
}

function Help()
{
    alert("The players alternately drop down chips in a grid." +
        "\nClick on an arrow to drop down a chip of your color." +
        "\nThe first player, who gets 4 chips in a horizontal," +
        "\nvertical or diagonal line, is the winner.");
}